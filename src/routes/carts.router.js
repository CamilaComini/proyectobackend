const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Obtener todos los carritos
router.get('/', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    res.json(carts);
});

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const newCart = {
        id: `${Date.now()}`,
        products: []
    };

    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const product = { id: pid }; // Puedes añadir más detalles del producto si lo necesitas
    cart.products.push(product);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(cart);
});

module.exports = router;
