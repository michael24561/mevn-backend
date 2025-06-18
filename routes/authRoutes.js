const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente'); // Cambiado a modelo Cliente

// Ruta de registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;
    
    const existeCliente = await Cliente.findOne({ email });
    if (existeCliente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    const cliente = new Cliente({ 
      nombre, 
      email, 
      password, 
      telefono,
      direccion,
      role: 'user' // Todos los clientes son 'user' por defecto
    });
    
    await cliente.save();
    
    res.status(201).json({ message: 'Cliente registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const cliente = await Cliente.findOne({ email }).select('+password');
    if (!cliente) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    const isMatch = await cliente.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    // Crear token JWT
    const token = jwt.sign(
      { 
        id: cliente._id, 
        email: cliente.email, 
        role: cliente.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Respuesta que NextAuth espera:
    res.json({ 
      token,
      cliente: { // Cambiado de empleado a cliente
        id: cliente._id,
        email: cliente.email,
        nombre: cliente.nombre,
        role: cliente.role,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;