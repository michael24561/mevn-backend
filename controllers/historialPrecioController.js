const HistorialPrecio = require("../models/HistorialPrecio");

// Crear historial de precio
exports.crearHistorial = async (req, res) => {
    try {
        const historial = new HistorialPrecio(req.body);
        await historial.save();
        res.status(201).json(historial);
    } catch (error) {
        res.status(400).json({ error: "Error al crear historial de precio", detalle: error.message });
    }
};

// Obtener todos los historiales
exports.obtenerHistoriales = async (req, res) => {
    try {
        const historiales = await HistorialPrecio.find().populate("producto");
        res.json(historiales);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historiales" });
    }
};

// Obtener historial por ID
exports.obtenerHistorialPorId = async (req, res) => {
    try {
        const historial = await HistorialPrecio.findById(req.params.id).populate("producto");
        if (!historial) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar historial" });
    }
};

// Actualizar historial
exports.actualizarHistorial = async (req, res) => {
    try {
        const actualizado = await HistorialPrecio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar historial" });
    }
};

// Eliminar historial
exports.eliminarHistorial = async (req, res) => {
    try {
        const eliminado = await HistorialPrecio.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }
        res.json({ mensaje: "Historial eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar historial" });
    }
};
