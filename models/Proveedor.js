const mongoose = require("mongoose");

const ProveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    contacto: { type: String },
    telefono: { type: String },
    email: { type: String }
});

module.exports = mongoose.model("Proveedor", ProveedorSchema);
