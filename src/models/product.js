const mongoose = require('../config/database'); // Importamos mongoose desde la conexión centralizada

// Definición del esquema del producto
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    availability: { 
        type: String, 
        enum: ['available', 'out_of_stock', 'preorder'], 
        default: 'available' 
    },
    stock: { type: Number, default: 0 },
}, {timestamps: true });

// Verifica si el modelo ya está definido para evitar la sobreescritura
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
