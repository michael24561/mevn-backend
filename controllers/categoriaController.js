// controllers/categoriaController.js
const Categoria = require("../models/Categoria");
const Producto = require("../models/Producto");

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "El nombre o slug de la categoría ya existe" });
        } else {
            res.status(400).json({ error: "Error al crear categoría", detalle: error.message });
        }
    }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({}, 'nombre descripcion slug destacada')
                                         .sort({ destacada: -1, nombre: 1 });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías", detalle: error.message });
    }
};

// Obtener categorías destacadas (para la página principal)
// controllers/categoriaController.js
exports.obtenerCategoriasDestacadas = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const categorias = await Categoria.find({ destacada: true }, 'nombre slug')
                                         .limit(limit)
                                         .sort({ nombre: 1 });
        
        if (categorias.length === 0) {
            // Si no hay categorías destacadas, devolver algunas por defecto
            return res.json([
                { _id: '1', nombre: 'Whiskies Premium', slug: 'whisky' },
                { _id: '2', nombre: 'Ron Añejo', slug: 'ron' },
                { _id: '3', nombre: 'Vodka de Lujo', slug: 'vodka' }
            ]);
        }
        
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener categorías destacadas",
            detalle: error.message 
        });
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
        res.status(500).json({ error: "Error al buscar categoría", detalle: error.message });
    }
};

// Obtener una categoría por slug (para las páginas de categoría)
exports.obtenerCategoriaPorSlug = async (req, res) => {
    try {
        const categoria = await Categoria.findOne({ slug: req.params.slug });
        if (!categoria) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        
        // Obtener productos de esta categoría
        const productos = await Producto.find({ categoria: categoria._id }, 'nombre precio imagen slug');
        
        res.json({
            categoria,
            productos
        });
    } catch (error) {
        res.status(500).json({ error: "Error al buscar categoría", detalle: error.message });
    }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!categoriaActualizada) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        
        res.json(categoriaActualizada);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "El nombre o slug de la categoría ya existe" });
        } else {
            res.status(400).json({ error: "Error al actualizar categoría", detalle: error.message });
        }
    }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        // Verificar si hay productos asociados
        const productosAsociados = await Producto.find({ categoria: req.params.id });
        
        if (productosAsociados.length > 0) {
            return res.status(400).json({ 
                error: "No se puede eliminar la categoría porque tiene productos asociados",
                productos: productosAsociados.map(p => p.nombre)
            });
        }

        // Si no hay productos, proceder con la eliminación
        const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
        
        if (!categoriaEliminada) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        
        res.json({ 
            mensaje: "Categoría eliminada correctamente",
            categoria: categoriaEliminada
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al eliminar categoría",
            detalle: error.message 
        });
    }
};