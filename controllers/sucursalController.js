const Sucursal = require("../models/Sucursal");

// Crear una nueva sucursal
exports.crearSucursal = async (req, res) => {
  try {
    const nuevaSucursal = new Sucursal(req.body);
    await nuevaSucursal.save();
    res.status(201).json(nuevaSucursal);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la sucursal", detalle: error.message });
  }
};

// Obtener todas las sucursales
exports.obtenerSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.find();
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las sucursales" });
  }
};

// Obtener una sucursal por ID
exports.obtenerSucursalPorId = async (req, res) => {
  try {
    const sucursal = await Sucursal.findById(req.params.id);
    if (!sucursal) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }
    res.json(sucursal);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar la sucursal" });
  }
};

// Actualizar una sucursal
exports.actualizarSucursal = async (req, res) => {
  try {
    const sucursalActualizada = await Sucursal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sucursalActualizada) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }
    res.json(sucursalActualizada);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar la sucursal", detalle: error.message });
  }
};

// Eliminar una sucursal
exports.eliminarSucursal = async (req, res) => {
  try {
    const sucursalEliminada = await Sucursal.findByIdAndDelete(req.params.id);
    if (!sucursalEliminada) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }
    res.json({ mensaje: "Sucursal eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la sucursal" });
  }
};
