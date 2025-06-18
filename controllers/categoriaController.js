const Categoria = require("../models/Categoria");

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(400).json({ error: "Error al crear categoría", detalle: error.message });
    }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
};

// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar categoría" });
    }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!categoriaActualizada) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.json(categoriaActualizada);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar categoría" });
    }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
        if (!categoriaEliminada) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.json({ mensaje: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar categoría" });
    }
};
