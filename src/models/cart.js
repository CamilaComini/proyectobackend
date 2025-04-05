// src/models/cart.js
const mongoose = require('../config/database'); // Importamos mongoose desde la conexión centralizada

// Definición del esquema del carrito
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencia al modelo User
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Referencia al modelo Product
            quantity: { type: Number, default: 1 } // Cantidad de productos en el carrito
        }
    ]
}, { timestamps: true });

// Crear y exportar el modelo
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
