const paypal = require('@paypal/checkout-server-sdk');
const mongoose = require('mongoose');
const Venta = require('../models/Venta');
const DetalleVenta = require('../models/DetalleVenta');
const Carrito = require('../models/Carrito');
const CarritoItem = require('../models/CarritoItem');
const Inventario = require('../models/Inventario');

// Configura el entorno de PayPal
const configurePaypal = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  
  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(environment);
};

const crearOrdenPaypal = async (req, res) => {
  try {
    const { clienteId } = req.body;
    const carrito = await Carrito.findOne({ cliente: clienteId }).populate('items.producto');

    if (!carrito) throw new Error('Carrito no encontrado');

    const paypalClient = configurePaypal();
    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: carrito.total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: carrito.total.toFixed(2)
            }
          }
        },
        items: carrito.items.map(item => ({
          name: item.producto.nombre,
          unit_amount: {
            currency_code: 'USD',
            value: item.precioUnitario.toFixed(2)
          },
          quantity: item.cantidad.toString()
        }))
      }],
      application_context: {
        return_url: 'http://localhost:3000/pago-exitoso',
        cancel_url: 'http://localhost:3000/pago-cancelado'
      }
    });

    const response = await paypalClient.execute(request);
    res.json({ id: response.result.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const capturarPago = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderID, clienteId } = req.body;
    const paypalClient = configurePaypal();
    
    // 1. Capturar pago en PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const capture = await paypalClient.execute(request);

    if (capture.result.status !== 'COMPLETED') {
      throw new Error('Pago no completado en PayPal');
    }

    // 2. Registrar venta en tu base de datos
    const carrito = await Carrito.findOne({ cliente: clienteId })
      .populate('items.producto')
      .session(session);

    const venta = new Venta({
      cliente: clienteId,
      total: carrito.total,
      metodoPago: 'paypal',
      estado: 'completada',
      paypalData: capture.result
    });

    // Procesar items
    for (const item of carrito.items) {
      const detalle = new DetalleVenta({
        venta: venta._id,
        producto: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.precioUnitario * item.cantidad
      });
      await detalle.save({ session });
      venta.items.push(detalle._id);
    }

    await venta.save({ session });
    await CarritoItem.deleteMany({ _id: { $in: carrito.items } }).session(session);
    await Carrito.findByIdAndDelete(carrito._id).session(session);
    await session.commitTransaction();

    res.json({ success: true, venta });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

  const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venta = await Venta.findById(id)
      .populate({
        path: 'items',
        populate: {
          path: 'producto',
          select: 'nombre precio imagen'
        }
      })
      .populate('cliente', 'nombre email');

    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        ...venta.toObject(),
        // Formatear datos si es necesario
        fecha: venta.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error en obtenerVentaPorId:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la venta',
      error: error.message
    });
  }
};

const obtenerHistorial = async (req, res) => {
  try {
    const { clienteId } = req.query;
    
    const ventas = await Venta.find({ cliente: clienteId })
      .populate({
        path: 'items',
        populate: { path: 'producto' }
      })
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: ventas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial',
      error: error.message
    });
  }
};

const procesarVentaSimulada = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { clienteId } = req.body;

    // 1. Obtener carrito
    const carrito = await Carrito.findOne({ cliente: clienteId })
      .populate('items.producto')
      .session(session);

    if (!carrito || carrito.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // 2. Simular datos de pago
    const pagoSimulado = {
      id: `PAY-SIM-${Math.random().toString(36).substr(2, 10)}`,
      status: 'COMPLETED',
      amount: carrito.total,
      currency: 'USD',
      create_time: new Date().toISOString(),
      payer: {
        email: 'comprador@simulado.com'
      }
    };

    // 3. Crear venta
    const venta = new Venta({
      cliente: clienteId,
      total: carrito.total,
      metodoPago: 'paypal',
      estado: 'completada',
      paypalData: pagoSimulado,
      items: []
    });

    // 4. Procesar items
    for (const item of carrito.items) {
      const detalle = new DetalleVenta({
        venta: venta._id,
        producto: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.precioUnitario * item.cantidad
      });

      await detalle.save({ session });
      venta.items.push(detalle._id);
    }

    // 5. Finalizar
    await venta.save({ session });
    await CarritoItem.deleteMany({ _id: { $in: carrito.items } }).session(session);
    await Carrito.findByIdAndDelete(carrito._id).session(session);
    await session.commitTransaction();

    res.json({ success: true, venta });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  } finally {
    session.endSession();
  }
};

module.exports = { 
  crearOrdenPaypal, 
  capturarPago, 
  obtenerHistorial,
  obtenerVentaPorId,
  procesarVentaSimulada 
};