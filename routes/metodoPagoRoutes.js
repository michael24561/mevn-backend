const express = require('express');
const router = express.Router();
const metodoPagoController = require('../controllers/metodoPagoController');

// Crear método de pago
router.post('/', metodoPagoController.crearMetodoPago);

// Obtener todos los métodos de pago
router.get('/', metodoPagoController.obtenerMetodosPago);

// Obtener un método de pago por ID
router.get('/:id', metodoPagoController.obtenerMetodoPagoPorId);

// Actualizar método de pago
router.put('/:id', metodoPagoController.actualizarMetodoPago);

// Eliminar método de pago
router.delete('/:id', metodoPagoController.eliminarMetodoPago);

module.exports = router;
