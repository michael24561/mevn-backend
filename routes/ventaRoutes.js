const express = require('express');
const router = express.Router();
const { 
  crearOrdenPaypal, 
  capturarPago, 
  obtenerHistorial,
  obtenerVentaPorId,
  procesarVentaSimulada
} = require('../controllers/ventaController');

router.post('/crear-orden-paypal', crearOrdenPaypal);
router.post('/capturar-pago', capturarPago);
router.post('/procesar-venta-simulada', procesarVentaSimulada);
router.get('/historial', obtenerHistorial);
router.get('/:id', obtenerVentaPorId);

module.exports = router;