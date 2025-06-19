const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Cliente", 
    required: true,
    unique: true
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
  fecha_creacion: { 
    type: Date, 
    default: Date.now 
  },
  estado: { 
    type: String, 
    enum: ['activo', 'procesado'], 
    default: 'activo' 
  }
});

CarritoSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    const populatedCart = await this.populate('items');
    this.total = populatedCart.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

module.exports = mongoose.model("Carrito", CarritoSchema);