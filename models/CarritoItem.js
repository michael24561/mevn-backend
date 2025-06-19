const mongoose = require("mongoose");

const CarritoItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
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
  },
  carrito: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carrito",
    required: true
  }
}, { timestamps: true });

// Calcular subtotal antes de guardar
CarritoItemSchema.pre('save', function(next) {
  this.subtotal = this.precioUnitario * this.cantidad;
  next();
});

module.exports = mongoose.model("CarritoItem", CarritoItemSchema);