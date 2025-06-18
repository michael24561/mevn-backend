const Venta = require("../models/Venta");

// Crear una nueva venta
exports.crearVenta = async (req, res) => {
    try {
        const nuevaVenta = new Venta(req.body);
        await nuevaVenta.save();
        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(400).json({ error: "Error al crear venta", detalle: error.message });
    }
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find()
            .populate("cliente", "nombre email")
            .populate("metodo_pago", "nombre");
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener ventas" });
    }
};

// Obtener una venta por ID
exports.obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id)
            .populate("cliente", "nombre email")
            .populate("metodo_pago", "nombre");

        if (!venta) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar la venta" });
    }
};

// Actualizar una venta
exports.actualizarVenta = async (req, res) => {
    try {
        const ventaActualizada = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ventaActualizada) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }
        res.json(ventaActualizada);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar la venta" });
    }
};

// Eliminar una venta
exports.eliminarVenta = async (req, res) => {
    try {
        const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
        if (!ventaEliminada) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }
        res.json({ mensaje: "Venta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la venta" });
    }
};
