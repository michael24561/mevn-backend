const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ClienteSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido']
  },
  password: { 
    type: String, 
    required: true,
    select: false // No se devuelve en las consultas por defecto
  },
  telefono: { 
    type: String, 
    required: true 
  },
  direccion: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  carrito: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrito'
  },
  fecha_registro: { 
    type: Date, 
    default: Date.now 
  },
    historialVentas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venta'
    }],
  ultimo_acceso: Date,
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Hash password antes de guardar
ClienteSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
ClienteSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para limpiar datos sensibles al enviar respuesta
ClienteSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Cliente', ClienteSchema);