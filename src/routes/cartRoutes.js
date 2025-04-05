const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.js'); // Importamos el modelo Cart
const Product = require('../models/product.js'); // Importamos el modelo Product

// Obtener todos los carritos con los productos completos
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product'); // Populamos los productos
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] }); // Creamos un carrito vacío
        await newCart.save(); // Guardamos el carrito
        res.status(201).json(newCart); // Respondemos con el carrito creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Agregar un producto al carrito con verificación de disponibilidad y stock
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid); // Buscamos el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Comprobamos si el producto ya está en el carrito
        const productExists = cart.products.find(p => p.product.toString() === pid);
        if (productExists) {
            return res.status(400).json({ error: 'El producto ya está en el carrito' });
        }

        // Verificar si el producto está disponible y tiene stock
        const product = await Product.findById(pid); // Buscamos el producto
        if (!product || product.availability !== true || product.stock <= 0) {
            return res.status(400).json({ error: 'El producto no está disponible o no tiene stock suficiente' });
        }

        // Si el producto no está, lo agregamos
        cart.products.push({ product: pid, quantity: 1 }); // Añadimos el producto con cantidad 1
        await cart.save(); // Guardamos el carrito con el nuevo producto
        res.status(201).json(cart); // Respondemos con el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid); // Buscamos el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Eliminamos el producto del carrito
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save(); // Guardamos el carrito actualizado
        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; // Esperamos recibir un array de productos
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }); // Actualizamos el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// Actualizar la cantidad de un producto en el carrito con verificación de stock
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body; 
    try {
        const cart = await Cart.findById(cid); // Buscamos el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Buscamos el índice del producto dentro del carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        // Verificar el stock disponible
        const product = await Product.findById(pid); // Buscamos el producto
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'No hay suficiente stock para esta cantidad' });
        }

        // Actualizamos la cantidad del producto
        cart.products[productIndex].quantity = quantity;
        await cart.save(); // Guardamos los cambios
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad' });
    }
});

// Vaciar el carrito (eliminar todos los productos)
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true }); // Vaciamos el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

// Obtener un carrito específico con productos completos
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product'); // Obtenemos el carrito con los productos
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta GET para obtener un carrito por ID con detalles de los productos
router.get('/api/carts/:id', async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.id).populate('products.productId');
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  });

module.exports = router;
