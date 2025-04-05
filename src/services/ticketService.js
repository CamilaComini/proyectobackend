import TicketRepository from '../repositories/ticketRepository.js';
import CartRepository from '../repositories/cartRepository.js';
import ProductRepository from '../repositories/productRepository.js';
import TicketDTO from '../dto/TicketDTO.js';
import { v4 as uuidv4 } from 'uuid'; // para generar código único

const ticketRepository = new TicketRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

export const createTicket = async (cartId, userId, userEmail) => {
  const cart = await cartRepository.getById(cartId);
  if (!cart || cart.items.length === 0) throw new Error('El carrito está vacío');

  let totalAmount = 0;
  const productsProcessed = [];
  const productsOutOfStock = [];

  for (const item of cart.items) {
    const product = await productRepository.getById(item.product._id);

    if (product.stock >= item.quantity) {
      // Descontar stock
      product.stock -= item.quantity;
      await productRepository.update(product._id, product);

      totalAmount += product.price * item.quantity;
      productsProcessed.push({
        product: product._id,
        quantity: item.quantity,
      });
    } else {
      productsOutOfStock.push(item);
    }
  }

  if (productsProcessed.length === 0) {
    throw new Error('No hay stock suficiente para ningún producto del carrito');
  }

  const code = uuidv4();
  const ticketDTO = new TicketDTO({
    code,
    amount: totalAmount,
    purchaser: userEmail,
    products: productsProcessed,
    createdAt: new Date()
  });

  const ticket = await ticketRepository.create(ticketDTO);
  await cartRepository.clear(cartId); // Limpiar carrito

  return {
    ticket,
    outOfStock: productsOutOfStock
  };
};