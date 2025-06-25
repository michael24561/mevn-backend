// routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Crear una nueva categoría
router.post('/', categoriaController.crearCategoria);

// Obtener todas las categorías
router.get('/', categoriaController.obtenerCategorias);

// Obtener categorías destacadas (para la página principal)
router.get('/destacadas', categoriaController.obtenerCategoriasDestacadas);

// Obtener una categoría por ID
router.get('/:id', categoriaController.obtenerCategoriaPorId);

// Obtener una categoría por slug
router.get('/slug/:slug', categoriaController.obtenerCategoriaPorSlug);

// Actualizar una categoría por ID
router.put('/:id', categoriaController.actualizarCategoria);

// Eliminar una categoría por ID
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;