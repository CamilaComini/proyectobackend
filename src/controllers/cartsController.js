const Cart = require('../models/cart');
const Product = require('../models/product');
const Joi = require('joi');

// Esquema de validación para agregar o actualizar productos en el carrito
const productInCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

// Obtener el carrito con detalles de los productos
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    next(error);
  }
};

// Agregar un producto al carrito
const addProductToCart = async (req, res, next) => {
  try {
    const { error, value } = productInCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', error: error.details[0].message });
    }

    const { productId, quantity } = value;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    let cart = await Cart.findById(req.params.cid);
    if (!cart) {
      // Crear un nuevo carrito si no existe
      cart = new Cart({ items: [] });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.productId.equals(productId));
    if (existingItem) {
      // Actualizar la cantidad si el producto ya está en el carrito
      existingItem.quantity += quantity;
    } else {
      // Agregar el nuevo producto al carrito
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    next(error);
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (req, res, next) => {
  try {
    const { error, value } = productInCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', error: error.details[0].message });
    }

    const { productId, quantity } = value;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    next(error);
  }
};

// Vaciar el carrito
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ status: 'success', message: 'Carrito vaciado con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart
};
