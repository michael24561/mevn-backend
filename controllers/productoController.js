const Producto = require("../models/Producto");
const mongoose = require('mongoose'); 
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configuración simple de Multer
const upload = multer({
  dest: 'public/uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF)'));
  }
}).single('imagen');

// Crear producto
exports.crearProducto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { nombre, descripcion, precio, stock, categoria, proveedor } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: "La imagen es requerida" });
      }

      const nuevoProducto = new Producto({
        nombre,
        descripcion,
        precio,
        stock,
        imagen: '/uploads/' + req.file.filename,
        categoria,
        proveedor
      });

      await nuevoProducto.save();
      
      res.status(201).json({
        ...nuevoProducto.toObject(),
        imagenUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ error: "Error al crear el producto" });
    }
  });
};

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate("categoria", "nombre")
      .populate("proveedor", "nombre");

    const productosConImagen = productos.map(p => ({
      ...p.toObject(),
      imagenUrl: `${req.protocol}://${req.get('host')}${p.imagen}`
    }));

    res.json(productosConImagen);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener producto por ID o slug
// Obtener producto por ID o slug - Versión mejorada
exports.obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validación básica del parámetro
    if (!id || id.trim() === "") {
      return res.status(400).json({ 
        error: "Se requiere un ID o slug válido",
        detalles: "No se proporcionó ningún identificador"
      });
    }

    let producto;
    const esObjectId = mongoose.Types.ObjectId.isValid(id);

    if (esObjectId) {
      producto = await Producto.findById(id)
        .populate("categoria", "nombre")
        .populate("proveedor", "nombre");
    } else {
      producto = await Producto.findOne({ slug: id.toLowerCase().trim() })
        .populate("categoria", "nombre")
        .populate("proveedor", "nombre");
    }

    if (!producto) {
      return res.status(404).json({ 
        error: "Producto no encontrado",
        detalles: `No se encontró producto con ID/slug: ${id}`,
        sugerencia: "Verifique el identificador o intente listar todos los productos primero"
      });
    }

    // Construir URL de imagen dinámica
    const protocol = req.protocol;
    const host = req.get('host');
    const imagenUrl = `${protocol}://${host}${producto.imagen}`;

    res.json({
      ...producto.toObject(),
      imagenUrl,
      links: {
        categoria: `${protocol}://${host}/api/categorias/${producto.categoria._id}`,
        proveedor: `${protocol}://${host}/api/proveedores/${producto.proveedor._id}`
      }
    });

  } catch (error) {
    console.error("Error en obtenerProducto:", error);
    res.status(500).json({ 
      error: "Error interno al buscar el producto",
      detalles: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (req.file) {
        updateData.imagen = '/uploads/' + req.file.filename;
      }

      const producto = await Producto.findByIdAndUpdate(id, updateData, { 
        new: true 
      });

      if (!producto) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json({
        ...producto.toObject(),
        imagenUrl: `${req.protocol}://${req.get('host')}${producto.imagen}`
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(400).json({ error: "Error al actualizar el producto" });
    }
  });
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};