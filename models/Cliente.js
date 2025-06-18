const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cliente", ClienteSchema);
