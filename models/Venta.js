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
  type: String,
  enum: ['paypal'], // luego podrías agregar más: ['paypal', 'yape', 'visa']
  default: 'paypal',
  required: true
},
paypalData: { type: Object } 
}, { timestamps: true });

module.exports = mongoose.model('Venta', VentaSchema);