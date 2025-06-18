const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialPrecioController');

// Crear historial de precio
router.post('/', historialController.crearHistorial);

// Obtener todos los historiales
router.get('/', historialController.obtenerHistoriales);

// Obtener historial por ID
router.get('/:id', historialController.obtenerHistorialPorId);

// Actualizar historial
router.put('/:id', historialController.actualizarHistorial);

// Eliminar historial
router.delete('/:id', historialController.eliminarHistorial);

module.exports = router;
