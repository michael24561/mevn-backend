const mongoose = require("mongoose");

const HistorialPrecioSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    precio_anterior: { type: Number, required: true },
    precio_nuevo: { type: Number, required: true },
    fecha_cambio: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HistorialPrecio", HistorialPrecioSchema);
