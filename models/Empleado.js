const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const empleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal' }
}, { timestamps: true });

// Hash password antes de guardar
empleadoSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
empleadoSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Empleado', empleadoSchema);