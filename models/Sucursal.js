const mongoose = require("mongoose");

const SucursalSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String }
});

module.exports = mongoose.model("Sucursal", SucursalSchema);
