const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Cliente", 
    required: true,
    unique: true // Un solo carrito por cliente
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarritoItem"
  }],
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  fecha_actualizacion: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Actualizar automáticamente el total y la fecha cuando cambian los items
CarritoSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    this.fecha_actualizacion = Date.now();
    const populatedCart = await this.populate('items');
    this.total = populatedCart.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

module.exports = mongoose.model("Carrito", CarritoSchema);