const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para productos
router.post('/', productoController.crearProducto); // Crear producto
router.get('/', productoController.obtenerProductos); // Obtener todos los productos
 // Obtener uno por ID
router.put('/:id', productoController.actualizarProducto); // Actualizar producto
router.delete('/:id', productoController.eliminarProducto); // Eliminar producto

module.exports = router;
