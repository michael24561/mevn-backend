const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');

// Crear un detalle de venta
router.post('/', detalleVentaController.crearDetalleVenta);

// Obtener todos los detalles de venta
router.get('/', detalleVentaController.obtenerDetallesVenta);

// Obtener un detalle de venta por ID
router.get('/:id', detalleVentaController.obtenerDetallePorId);

// Actualizar un detalle de venta
router.put('/:id', detalleVentaController.actualizarDetalle);

// Eliminar un detalle de venta
router.delete('/:id', detalleVentaController.eliminarDetalle);

module.exports = router;
