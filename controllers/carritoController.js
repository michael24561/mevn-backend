const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

// Crear un carrito nuevo
exports.crearCarrito = async (req, res) => {
  try {
    const carrito = new Carrito(req.body);
    await carrito.save();
    res.status(201).json(carrito);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el carrito", detalle: error.message });
  }
};

// Obtener el carrito de un cliente
exports.obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ cliente: req.params.clienteId, estado: 'activo' })
      .populate("productos.producto", "nombre precio")
      .populate("cliente", "nombre email");

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// Agregar un producto al carrito
exports.agregarProducto = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    // Buscar el producto
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscar el carrito del cliente
    const carrito = await Carrito.findOne({ cliente: req.params.clienteId, estado: 'activo' });

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado o ya procesado" });
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.productos.find(p => p.producto.toString() === productoId);

    if (productoExistente) {
      // Si ya existe, actualizar la cantidad y el subtotal
      productoExistente.cantidad += cantidad;
      productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio_unitario;
    } else {
      // Si no existe, agregarlo al carrito
      carrito.productos.push({
        producto: productoId,
        cantidad,
        precio_unitario: producto.precio,
        subtotal: cantidad * producto.precio
      });
    }

    // Actualizar el total del carrito
    carrito.total = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);

    // Guardar el carrito actualizado
    await carrito.save();

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito", detalle: error.message });
  }
};

// Actualizar el estado del carrito (por ejemplo, cuando se completa la compra)
exports.actualizarEstadoCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado del carrito", detalle: error.message });
  }
};

// Eliminar un carrito (cuando se abandona o se cancela)
exports.eliminarCarrito = async (req, res) => {
  try {
    const carritoEliminado = await Carrito.findByIdAndDelete(req.params.id);

    if (!carritoEliminado) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ mensaje: "Carrito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el carrito", detalle: error.message });
  }
};
