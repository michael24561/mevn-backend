const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Crear una nueva venta
router.post('/', ventaController.crearVenta);

// Obtener todas las ventas
router.get('/', ventaController.obtenerVentas);

// Obtener una venta por ID
router.get('/:id', ventaController.obtenerVentaPorId);

// Actualizar una venta
router.put('/:id', ventaController.actualizarVenta);

// Eliminar una venta
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;
