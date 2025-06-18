const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Crear un nuevo proveedor
router.post('/', proveedorController.crearProveedor);

// Obtener todos los proveedores
router.get('/', proveedorController.obtenerProveedores);

// Obtener un proveedor por ID
router.get('/:id', proveedorController.obtenerProveedorPorId);

// Actualizar un proveedor
router.put('/:id', proveedorController.actualizarProveedor);

// Eliminar un proveedor
router.delete('/:id', proveedorController.eliminarProveedor);

module.exports = router;
