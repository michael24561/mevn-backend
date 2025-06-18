const mongoose = require("mongoose");

const VentaSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    fecha_venta: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    metodo_pago: { type: mongoose.Schema.Types.ObjectId, ref: "MetodoPago", required: true }
});

module.exports = mongoose.model("Venta", VentaSchema);
