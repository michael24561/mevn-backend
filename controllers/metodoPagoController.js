const MetodoPago = require("../models/MetodoPago");

// Crear método de pago
exports.crearMetodoPago = async (req, res) => {
    try {
        const metodo = new MetodoPago(req.body);
        await metodo.save();
        res.status(201).json(metodo);
    } catch (error) {
        res.status(400).json({ error: "Error al crear método de pago", detalle: error.message });
    }
};

// Obtener todos los métodos de pago
exports.obtenerMetodosPago = async (req, res) => {
    try {
        const metodos = await MetodoPago.find();
        res.json(metodos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener métodos de pago" });
    }
};

// Obtener un método de pago por ID
exports.obtenerMetodoPagoPorId = async (req, res) => {
    try {
        const metodo = await MetodoPago.findById(req.params.id);
        if (!metodo) {
            return res.status(404).json({ error: "Método de pago no encontrado" });
        }
        res.json(metodo);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar método de pago" });
    }
};

// Actualizar método de pago
exports.actualizarMetodoPago = async (req, res) => {
    try {
        const actualizado = await MetodoPago.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ error: "Método de pago no encontrado" });
        }
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar método de pago" });
    }
};

// Eliminar método de pago
exports.eliminarMetodoPago = async (req, res) => {
    try {
        const eliminado = await MetodoPago.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Método de pago no encontrado" });
        }
        res.json({ mensaje: "Método de pago eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar método de pago" });
    }
};
