const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DetalleVenta'
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  metodoPago: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MetodoPago',
    required: true
  },
  sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sucursal',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Venta', VentaSchema);