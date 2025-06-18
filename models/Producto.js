const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    imagen: { type: String, required: true }, // Guardará la ruta de la imagen
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true }
});

module.exports = mongoose.model("Producto", ProductoSchema);