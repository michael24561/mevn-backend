const DetalleVenta = require("../models/DetalleVenta");

// Crear un detalle de venta
exports.crearDetalleVenta = async (req, res) => {
    try {
        const detalle = new DetalleVenta(req.body);
        await detalle.save();
        res.status(201).json(detalle);
    } catch (error) {
        res.status(400).json({ error: "Error al crear detalle de venta", detalle: error.message });
    }
};

// Obtener todos los detalles de venta
exports.obtenerDetallesVenta = async (req, res) => {
    try {
        const detalles = await DetalleVenta.find()
            .populate("venta")
            .populate("producto", "nombre precio");
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalles de venta" });
    }
};

// Obtener detalle por ID
exports.obtenerDetallePorId = async (req, res) => {
    try {
        const detalle = await DetalleVenta.findById(req.params.id)
            .populate("venta")
            .populate("producto", "nombre precio");

        if (!detalle) {
            return res.status(404).json({ error: "Detalle no encontrado" });
        }

        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el detalle" });
    }
};

// Actualizar detalle
exports.actualizarDetalle = async (req, res) => {
    try {
        const actualizado = await DetalleVenta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ error: "Detalle no encontrado" });
        }
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar el detalle" });
    }
};

// Eliminar detalle
exports.eliminarDetalle = async (req, res) => {
    try {
        const eliminado = await DetalleVenta.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Detalle no encontrado" });
        }
        res.json({ mensaje: "Detalle eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el detalle" });
    }
};
