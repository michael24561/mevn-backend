const mongoose = require("mongoose");

const DetalleVentaSchema = new mongoose.Schema({
    venta: { type: mongoose.Schema.Types.ObjectId, ref: "Venta", required: true },
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    cantidad: { type: Number, required: true },
    precio_unitario: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

module.exports = mongoose.model("DetalleVenta", DetalleVentaSchema);
