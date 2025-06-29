const mongoose = require('mongoose');
const Venta = require('../models/Venta');
const Carrito = require('../models/Carrito');
const CarritoItem = require('../models/CarritoItem');
const Producto = require('../models/Producto');

const procesarVenta = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { clienteId } = req.body;

    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    const carrito = await Carrito.findOne({ cliente: clienteId })
      .populate({
        path: 'items',
        populate: { path: 'producto', model: 'Producto' }
      })
      .session(session);

    if (!carrito || carrito.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Preparar items y verificar stock
    const itemsVenta = [];
    for (const item of carrito.items) {
      if (item.producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para: ${item.producto.nombre}`);
      }

      itemsVenta.push({
        producto: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      });

      await Producto.findByIdAndUpdate(
        item.producto._id,
        { $inc: { stock: -item.cantidad } },
        { session }
      );
    }

    // Crear venta (el código se genera automáticamente)
    const venta = new Venta({
      cliente: clienteId,
      items: itemsVenta,
      total: carrito.total
    });

    // Guardar y limpiar carrito
    await venta.save({ session });
    await CarritoItem.deleteMany({ _id: { $in: carrito.items } }).session(session);
    carrito.items = [];
    carrito.total = 0;
    await carrito.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      data: await Venta.findById(venta._id)
        .populate('items.producto', 'nombre precio imagen')
        .populate('cliente', 'nombre email')
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

const obtenerTodasLasVentas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado } = req.query;
    
    const filtro = {};
    
    // Filtro por fechas
    if (fechaInicio && fechaFin) {
      filtro.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    
    // Filtro por estado
    if (estado) {
      filtro.estado = estado;
    }
    
    const ventas = await Venta.find(filtro)
      .populate('cliente', 'nombre email')
      .populate('items.producto', 'nombre precio')
      .sort({ fecha: -1 });
    
    res.json({ success: true, data: ventas });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// En tu controlador de ventas (backend)
const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId } = req.query;

    // Validar que la venta pertenece al cliente
    const venta = await Venta.findOne({
      _id: id,
      cliente: clienteId
    })
    .populate('items.producto', 'nombre precio imagen')
    .populate('cliente', 'nombre email');

    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada o no pertenece al cliente'
      });
    }

    // Asegúrate de enviar la respuesta como JSON
    res.json({ 
      success: true, 
      data: venta 
    });

  } catch (error) {
    // Asegúrate de que los errores también sean JSON
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const obtenerHistorialCliente = async (req, res) => {
  try {
    const ventas = await Venta.find({ cliente: req.query.clienteId })
      .populate('items.producto', 'nombre imagen')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: ventas });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  procesarVenta,
  obtenerVentaPorId,
  obtenerHistorialCliente,
  obtenerTodasLasVentas
};