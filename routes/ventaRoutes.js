const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

router.post('/', ventaController.procesarVenta);
router.get('/:id', ventaController.obtenerVentaPorId);
router.get('/historial/cliente', ventaController.obtenerHistorialCliente);

module.exports = router;