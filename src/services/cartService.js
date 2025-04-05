const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository');

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

const getCartById = (cartId) => cartRepository.getById(cartId);

const addToCart = async (cartId, productId, quantity) => {
  const product = await productRepository.getById(productId);
  if (!product) throw new Error('Producto no encontrado');
  return cartRepository.addItem(cartId, productId, quantity);
};

const removeFromCart = (cartId, productId) => {
  return cartRepository.removeItem(cartId, productId);
};

const clearCart = (cartId) => cartRepository.clear(cartId);

module.exports = {
  getCartById,
  addToCart,
  removeFromCart,
  clearCart
};