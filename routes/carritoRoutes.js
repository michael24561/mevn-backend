const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

// Crear un nuevo carrito
router.post('/', carritoController.crearCarrito);

// Obtener el carrito activo de un cliente por su ID
router.get('/:clienteId', carritoController.obtenerCarrito);

// Agregar un producto al carrito de un cliente
router.post('/agregar/:clienteId', carritoController.agregarProducto);

// Actualizar el estado del carrito (por ejemplo a 'procesado')
router.put('/estado/:id', carritoController.actualizarEstadoCarrito);

// Eliminar un carrito por ID
router.delete('/:id', carritoController.eliminarCarrito);

module.exports = router;
