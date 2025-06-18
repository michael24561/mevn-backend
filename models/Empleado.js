const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  sucursal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sucursal',
    required: true 
  },
  puesto: String,
  fecha_contratacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Empleado', empleadoSchema);