const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
    cliente: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Cliente", 
        required: true 
    },
    productos: [{
        producto: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Producto", 
            required: true 
        },
        cantidad: { 
            type: Number, 
            required: true 
        },
        precio_unitario: { 
            type: Number, 
            required: true 
        },
        subtotal: { 
            type: Number, 
            required: true 
        }
    }],
    total: { 
        type: Number, 
        required: true 
    },
    fecha_creacion: { 
        type: Date, 
        default: Date.now 
    },
    estado: { 
        type: String, 
        enum: ['activo', 'procesado'], 
        default: 'activo' 
    }
});

module.exports = mongoose.model("Carrito", CarritoSchema);
