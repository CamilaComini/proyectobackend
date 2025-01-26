const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

// Obtener todos los productos (con límite opcional)
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// Crear un nuevo producto
router.post('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const newProduct = {
        id: `${Date.now()}`,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const productIndex = products.findIndex(p => p.id === req.params.pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updates = req.body;
    if (updates.id) {
        return res.status(400).json({ error: 'No se puede actualizar el ID del producto' });
    }

    products[productIndex] = { ...products[productIndex], ...updates };
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json(products[productIndex]);
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const newProducts = products.filter(p => p.id !== req.params.pid);

    if (products.length === newProducts.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, 2));
    res.json({ message: 'Producto eliminado con éxito' });
});

module.exports = router;
