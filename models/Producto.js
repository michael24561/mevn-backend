const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true
    },
    descripcion: { 
        type: String,
        required: true
    },
    precio: { 
        type: Number, 
        required: true,
        min: 0
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0
    },
    imagen: { 
        type: String, 
        required: true
    },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Categoria", 
        required: true 
    },
    proveedor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Proveedor", 
        required: true 
    },
    destacado: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

// Generar slug automáticamente
ProductoSchema.pre('save', function(next) {
    if (this.isModified('nombre')) {
        this.slug = this.nombre.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model("Producto", ProductoSchema);