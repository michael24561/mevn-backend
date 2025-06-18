const Inventario = require("../models/Inventario");

// Crear inventario
exports.crearInventario = async (req, res) => {
    try {
        const inventario = new Inventario(req.body);
        await inventario.save();
        res.status(201).json(inventario);
    } catch (error) {
        res.status(400).json({ error: "Error al crear el inventario", detalle: error.message });
    }
};

// Obtener todos los inventarios
exports.obtenerInventarios = async (req, res) => {
    try {
        const inventarios = await Inventario.find()
            .populate("producto")
            .populate("sucursal");
        res.json(inventarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener inventarios" });
    }
};

// Obtener un inventario por ID
exports.obtenerInventarioPorId = async (req, res) => {
    try {
        const inventario = await Inventario.findById(req.params.id)
            .populate("producto")
            .populate("sucursal");

        if (!inventario) {
            return res.status(404).json({ error: "Inventario no encontrado" });
        }

        res.json(inventario);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar inventario" });
    }
};

// Actualizar inventario
exports.actualizarInventario = async (req, res) => {
    try {
        const actualizado = await Inventario.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!actualizado) {
            return res.status(404).json({ error: "Inventario no encontrado" });
        }

        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar inventario" });
    }
};

// Eliminar inventario
exports.eliminarInventario = async (req, res) => {
    try {
        const eliminado = await Inventario.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return res.status(404).json({ error: "Inventario no encontrado" });
        }

        res.json({ mensaje: "Inventario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar inventario" });
    }
};
