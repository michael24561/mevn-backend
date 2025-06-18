const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Añade esta línea
const Empleado = require('../models/Empleado');

// Ruta de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existeEmpleado = await Empleado.findOne({ email });
    if (existeEmpleado) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    const empleado = new Empleado({ 
      nombre: name, 
      email, 
      password, 
      role: role || 'user' // Asegúrate que tu modelo use "role" y no "rol"
    });
    
    await empleado.save();
    
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const empleado = await Empleado.findOne({ email });
    if (!empleado) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    const isMatch = await empleado.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    // Crear token JWT (usa el mismo nombre de campo que en tu modelo)
    const token = jwt.sign(
      { 
        id: empleado._id, 
        email: empleado.email, 
        role: empleado.role // Cambiado de "rol" a "role" para consistencia
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Respuesta que NextAuth espera:
    res.json({ 
      token,
      empleado: {
        id: empleado._id,
        email: empleado.email,
        nombre: empleado.nombre,
        role: empleado.role // Asegúrate que coincida con el modelo
      }
    });
  } catch (error) {
    console.error('Error en login:', error); // Log para depuración
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;