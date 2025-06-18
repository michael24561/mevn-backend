const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// Crear un nuevo empleado
router.post('/', empleadoController.crearEmpleado);

// Obtener todos los empleados
router.get('/', empleadoController.obtenerEmpleados);

// Obtener un empleado por ID
router.get('/:id', empleadoController.obtenerEmpleadoPorId);

// Actualizar un empleado
router.put('/:id', empleadoController.actualizarEmpleado);

// Eliminar un empleado
router.delete('/:id', empleadoController.eliminarEmpleado);

module.exports = router;
