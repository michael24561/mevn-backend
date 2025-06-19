const Carrito = require('../models/Carrito');
const CarritoItem = require('../models/CarritoItem');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');

// Obtener o crear carrito
const obtenerCarrito = async (req, res) => {
  try {
    const clienteId = req.query.clienteId || req.body.clienteId || req.params.clienteId;

    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: 'clienteId es requerido'
      });
    }

    let carrito = await Carrito.findOne({ cliente: clienteId })
      .populate({
        path: 'items',
        populate: { path: 'producto', model: 'Producto' }
      });

    if (!carrito) {
      carrito = new Carrito({ cliente: clienteId, items: [], total: 0 });
      await carrito.save();
      await Cliente.findByIdAndUpdate(clienteId, { carrito: carrito._id });
    }

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el carrito',
      error: error.message
    });
  }
};

// Agregar item al carrito
const agregarItem = async (req, res) => {
  try {
    const { productoId, cantidad, clienteId } = req.body;

    if (!productoId || !cantidad || !clienteId) {
      return res.status(400).json({
        success: false,
        message: 'productoId, cantidad y clienteId son requeridos'
      });
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        stockDisponible: producto.stock
      });
    }

    let carrito = await Carrito.findOne({ cliente: clienteId });
    if (!carrito) {
      carrito = new Carrito({ cliente: clienteId, items: [], total: 0 });
      await carrito.save();
      await Cliente.findByIdAndUpdate(clienteId, { carrito: carrito._id });
    }

    const itemExistente = await CarritoItem.findOne({
      producto: productoId,
      carrito: carrito._id
    });

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
      await itemExistente.save();
    } else {
      const nuevoItem = new CarritoItem({
        producto: productoId,
        cantidad,
        precioUnitario: producto.precio,
        subtotal: cantidad * producto.precio,
        carrito: carrito._id
      });
      await nuevoItem.save();
      carrito.items.push(nuevoItem._id);
    }

    const items = await CarritoItem.find({ carrito: carrito._id });
    carrito.total = items.reduce((sum, item) => sum + item.subtotal, 0);
    await carrito.save();

    const carritoActualizado = await Carrito.findById(carrito._id)
      .populate({ path: 'items', populate: { path: 'producto', model: 'Producto' } });

    res.status(200).json({
      success: true,
      carrito: carritoActualizado
    });

  } catch (error) {
    console.error('Error en agregarItem:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar item
const actualizarItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { cantidad, clienteId } = req.body;

    if (!clienteId || !cantidad || cantidad < 1) {
      return res.status(400).json({
        success: false,
        message: 'clienteId y una cantidad válida son requeridos'
      });
    }

    const carrito = await Carrito.findOne({ cliente: clienteId });
    if (!carrito) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    const item = await CarritoItem.findOne({
      _id: itemId,
      carrito: carrito._id
    }).populate('producto');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado en el carrito'
      });
    }

    if (item.producto.stock < cantidad) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        stockDisponible: item.producto.stock
      });
    }

    item.cantidad = cantidad;
    item.subtotal = cantidad * item.precioUnitario;
    await item.save();

    const items = await CarritoItem.find({ carrito: carrito._id });
    carrito.total = items.reduce((sum, item) => sum + item.subtotal, 0);
    await carrito.save();

    const carritoActualizado = await Carrito.findById(carrito._id)
      .populate({ path: 'items', populate: { path: 'producto', model: 'Producto' } });

    res.status(200).json({
      success: true,
      carrito: carritoActualizado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar item del carrito',
      error: error.message
    });
  }
};

// Eliminar item del carrito
const eliminarItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const clienteId = req.query.clienteId || req.body.clienteId;

    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: 'clienteId es requerido'
      });
    }

    const carrito = await Carrito.findOne({ cliente: clienteId });
    if (!carrito) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    const itemIndex = carrito.items.findIndex(item => item.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado en el carrito'
      });
    }

    await CarritoItem.findByIdAndDelete(itemId);
    carrito.items.splice(itemIndex, 1);

    const items = await CarritoItem.find({ carrito: carrito._id });
    carrito.total = items.reduce((sum, item) => sum + item.subtotal, 0);
    await carrito.save();

    const carritoActualizado = await Carrito.findById(carrito._id)
      .populate({ path: 'items', populate: { path: 'producto', model: 'Producto' } });

    res.status(200).json({
      success: true,
      carrito: carritoActualizado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar item del carrito',
      error: error.message
    });
  }
};

// Vaciar carrito
const vaciarCarrito = async (req, res) => {
  try {
    const clienteId = req.query.clienteId || req.body.clienteId;

    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: 'clienteId es requerido'
      });
    }

    const carrito = await Carrito.findOne({ cliente: clienteId });
    if (!carrito) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    await CarritoItem.deleteMany({ _id: { $in: carrito.items } });
    carrito.items = [];
    carrito.total = 0;
    await carrito.save();

    res.status(200).json({
      success: true,
      carrito
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al vaciar el carrito',
      error: error.message
    });
  }
};

module.exports = {
  obtenerCarrito,
  agregarItem,
  actualizarItem,
  eliminarItem,
  vaciarCarrito
};
