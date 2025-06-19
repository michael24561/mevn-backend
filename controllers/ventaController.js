const Venta = require('../models/Venta');
const DetalleVenta = require('../models/DetalleVenta');
const Carrito = require('../models/Carrito');
const CarritoItem = require('../models/CarritoItem');
const Inventario = require('../models/Inventario');

const crearVenta = async (req, res) => {
  try {
    const { metodoPagoId } = req.body;
    const clienteId = req.user.id; // Asume que NextAuth inyecta esto

    // 1. Validar carrito
    const carrito = await Carrito.findOne({ cliente: clienteId }).populate({
      path: 'items',
      populate: { path: 'producto' }
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El carrito está vacío'
      });
    }

    // 2. Crear venta
    const venta = new Venta({
      cliente: clienteId,
      items: [],
      total: carrito.total,
      metodoPago: metodoPagoId,
      sucursal: carrito.sucursal
    });

    // 3. Procesar items
    for (const item of carrito.items) {
      const inventario = await Inventario.findOne({
        producto: item.producto._id,
        sucursal: carrito.sucursal
      });

      if (!inventario || inventario.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para: ${item.producto.nombre}`);
      }

      const detalle = new DetalleVenta({
        venta: venta._id,
        producto: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      });

      await detalle.save();
      venta.items.push(detalle._id);
      inventario.stock -= item.cantidad;
      await inventario.save();
    }

    // 4. Finalizar
    await venta.save();
    await CarritoItem.deleteMany({ _id: { $in: carrito.items } });
    await Carrito.findByIdAndDelete(carrito._id);

    res.status(201).json({
      success: true,
      data: await venta.populate(['items', 'metodoPago'])
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar la venta',
      error: error.message
    });
  }
};

const obtenerHistorial = async (req, res) => {
  try {
    const ventas = await Venta.find({ cliente: req.user.id })
      .populate({
        path: 'items',
        populate: { path: 'producto' }
      })
      .sort({ fecha: -1 });

    res.json({ success: true, data: ventas });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial',
      error: error.message
    });
  }
};

module.exports = { crearVenta, obtenerHistorial };