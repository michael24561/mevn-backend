const mongoose = require('mongoose');

const DetalleVentaSchema = new mongoose.Schema({
  venta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venta',
    required: true
  },
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
}, { timestamps: true });

// Calcular subtotal automáticamente
DetalleVentaSchema.pre('save', function(next) {
  this.subtotal = this.precioUnitario * this.cantidad;
  next();
});

module.exports = mongoose.model('DetalleVenta', DetalleVentaSchema);