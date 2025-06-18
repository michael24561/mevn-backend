const Proveedor = require("../models/Proveedor");

// Crear un nuevo proveedor
exports.crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    await nuevoProveedor.save();
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el proveedor", detalle: error.message });
  }
};

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los proveedores" });
  }
};

// Obtener un proveedor por ID
exports.obtenerProveedorPorId = async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el proveedor" });
  }
};

// Actualizar un proveedor
exports.actualizarProveedor = async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!proveedorActualizado) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el proveedor", detalle: error.message });
  }
};

// Eliminar un proveedor
exports.eliminarProveedor = async (req, res) => {
  try {
    const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedorEliminado) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el proveedor" });
  }
};
