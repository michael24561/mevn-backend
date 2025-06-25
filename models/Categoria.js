// models/Categoria.js
const mongoose = require("mongoose");

const CategoriaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    destacada: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Middleware para generar el slug antes de guardar
CategoriaSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.nombre.toLowerCase()
                           .replace(/[^a-z0-9]+/g, '-')
                           .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model("Categoria", CategoriaSchema);