const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Procesar checkout
router.post('/checkout', ventaController.crearVenta);

// Obtener historial
router.get('/historial', ventaController.obtenerHistorial);

module.exports = router;