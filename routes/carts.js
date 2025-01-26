const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

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

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const { pid } = req.params;
    const existingProduct = cart.products.find(p => p.product === pid);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.json(cart);
});

module.exports = router;
