const Producto = require("../models/Producto");
const multer = require('multer');
const path = require('path');

// Configuración de Multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Asegúrate que esta carpeta exista
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Solo se permiten imágenes (JPEG, JPG, PNG, GIF)'));
  }
}).single('imagen'); // 'imagen' es el nombre del campo en el formulario

// Crear un nuevo producto (con imagen)
exports.crearProducto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { nombre, descripcion, precio, stock, categoria, proveedor } = req.body;
      const imagen = req.file ? '/uploads/' + req.file.filename : null;

      if (!imagen) {
        return res.status(400).json({ error: "La imagen es requerida" });
      }

      const nuevoProducto = new Producto({
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
        categoria,
        proveedor
      });

      await nuevoProducto.save();
      res.status(201).json(nuevoProducto);
    } catch (error) {
      res.status(400).json({ error: "Error al crear el producto", detalle: error.message });
    }
  });
};

// Actualizar un producto (con o sin imagen)
exports.actualizarProducto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { nombre, descripcion, precio, stock, categoria, proveedor } = req.body;
      const updateData = {
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        proveedor
      };

      // Si se subió una nueva imagen, actualizamos la ruta
      if (req.file) {
        updateData.imagen = '/uploads/' + req.file.filename;
      }

      const productoActualizado = await Producto.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        { new: true }
      ).populate("categoria", "nombre")
       .populate("proveedor", "nombre");

      if (!productoActualizado) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(productoActualizado);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar el producto", detalle: error.message });
    }
  });
};

// Los demás métodos (obtenerProductos, obtenerProductoPorId, eliminarProducto)
// se mantienen igual que en tu código actual

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate("categoria", "nombre")
      .populate("proveedor", "nombre");
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate("categoria", "nombre")
      .populate("proveedor", "nombre");
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el producto" });
  }
};


// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
