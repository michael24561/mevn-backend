const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

// Crear una nueva sucursal
router.post('/', sucursalController.crearSucursal);

// Obtener todas las sucursales
router.get('/', sucursalController.obtenerSucursales);

// Obtener una sucursal por ID
router.get('/:id', sucursalController.obtenerSucursalPorId);

// Actualizar una sucursal
router.put('/:id', sucursalController.actualizarSucursal);

// Eliminar una sucursal
router.delete('/:id', sucursalController.eliminarSucursal);

module.exports = router;
