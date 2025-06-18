const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Crear inventario
router.post('/', inventarioController.crearInventario);

// Obtener todos los inventarios
router.get('/', inventarioController.obtenerInventarios);

// Obtener un inventario por ID
router.get('/:id', inventarioController.obtenerInventarioPorId);

// Actualizar inventario
router.put('/:id', inventarioController.actualizarInventario);

// Eliminar inventario
router.delete('/:id', inventarioController.eliminarInventario);

module.exports = router;
