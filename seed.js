const mongoose = require("mongoose");
require("dotenv").config();

// Importar modelos
const Cliente = require("./models/Cliente");
const Producto = require("./models/Producto");
const Categoria = require("./models/Categoria");
const Proveedor = require("./models/Proveedor");

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB");

    // Crear categoría y proveedor de ejemplo
    const categoria = await Categoria.create({ nombre: "Whisky" });
    const proveedor = await Proveedor.create({ nombre: "Bebidas SA", contacto: "Luis", telefono: "999888777", email: "contacto@bebidas.com" });

    // Crear clientes
    await Cliente.insertMany([
      { nombre: "Juan Pérez", email: "juan@example.com", telefono: "987654321", direccion: "Calle Falsa 123" },
      { nombre: "María López", email: "maria@example.com", telefono: "123456789", direccion: "Av. Principal 456" }
    ]);

    // Crear productos
    await Producto.insertMany([
      {
        nombre: "Johnnie Walker",
        descripcion: "Whisky escocés",
        precio: 120,
        stock: 50,
        categoria: categoria._id,
        proveedor: proveedor._id
      }
    ]);

    console.log("✅ Datos insertados correctamente");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Error:", err));
