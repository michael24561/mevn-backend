const mongoose = require("mongoose");

const InventarioSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: "Sucursal", required: true },
    stock_actual: { type: Number, required: true }
});

module.exports = mongoose.model("Inventario", InventarioSchema);
