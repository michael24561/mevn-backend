const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  codigoVenta: {
    type: String,
    unique: true,
    required: true,
    default: () => `VEN-${Date.now()}-${Math.floor(Math.random() * 1000)}` // Genera código único
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  items: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
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
    enum: ['en proceso', 'cancelada', 'completada'],
    default: 'en proceso'
  }
}, { timestamps: true });

module.exports = mongoose.model('Venta', VentaSchema);