import CartRepository from '../repositories/cartRepository.js';
import ProductRepository from '../repositories/productRepository.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

export const getCartById = (cartId) => cartRepository.getById(cartId);

export const addToCart = async (cartId, productId, quantity) => {
  const product = await productRepository.getById(productId);
  if (!product) throw new Error('Producto no encontrado');
  return cartRepository.addItem(cartId, productId, quantity);
};

export const removeFromCart = (cartId, productId) => {
  return cartRepository.removeItem(cartId, productId);
};

export const clearCart = (cartId) => cartRepository.clear(cartId);