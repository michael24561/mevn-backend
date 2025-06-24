const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

// Obtener carrito del usuario actual
router.get('/', carritoController.obtenerCarrito);

// Agregar item al carrito
router.post('/items', carritoController.agregarItem);

// Actualizar cantidad de un item
router.put('/items/:itemId', carritoController.actualizarItem);

// Eliminar item del carrito
router.delete('/items/:itemId', carritoController.eliminarItem);

// Vaciar carrito
router.delete('/', carritoController.vaciarCarrito);

module.exports = router;