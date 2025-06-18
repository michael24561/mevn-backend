const Empleado = require("../models/Empleado");

// Crear empleado
exports.crearEmpleado = async (req, res) => {
    try {
        const empleado = new Empleado(req.body);
        await empleado.save();
        res.status(201).json(empleado);
    } catch (error) {
        res.status(400).json({ error: "Error al crear empleado", detalle: error.message });
    }
};

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener empleados" });
    }
};

// Obtener empleado por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.json(empleado);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar empleado" });
    }
};

// Actualizar empleado
exports.actualizarEmpleado = async (req, res) => {
    try {
        const actualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar empleado" });
    }
};

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
    try {
        const eliminado = await Empleado.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.json({ mensaje: "Empleado eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar empleado" });
    }
};
