import TicketRepository from '../repositories/ticketRepository.js';
import CartRepository from '../repositories/cartRepository.js';
import ProductRepository from '../repositories/productRepository.js';
import { v4 as uuidv4 } from 'uuid';
import { sendPurchaseEmail } from '../utils/mailer.js';

const ticketRepository = new TicketRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

export const createTicket = async (cartId, user) => {
  const cart = await cartRepository.getById(cartId);
  if (!cart || cart.items.length === 0) throw new Error('El carrito está vacío');

  const productosProcesables = [];
  const productosNoProcesados = [];

  // 1. Verificar stock producto por producto
  for (const item of cart.items) {
    const product = await productRepository.getById(item.productId);
    if (!product) continue;

    if (product.stock >= item.quantity) {
      // restar stock
      await productRepository.update(product._id, {
        stock: product.stock - item.quantity,
      });
      productosProcesables.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    } else {
      productosNoProcesados.push(item);
    }
  }

  if (productosProcesables.length === 0) {
    throw new Error('No hay productos con stock suficiente para procesar');
  }

  // 2. Calcular total de compra
  const total = productosProcesables.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 3. Crear ticket
  const ticketData = {
    code: uuidv4(),
    amount: total,
    purchaser: user.email,
    purchase_datetime: new Date(),
    cartId,
  };
  const ticket = await ticketRepository.create(ticketData);

  // 4. Dejar en el carrito solo los productos NO procesados
  await cartRepository.update(cartId, { items: productosNoProcesados });

  // Enviar mail al comprador
  await sendPurchaseEmail(user.email, ticket);

  // 5. Devolver el ticket y los no procesados
  return {
    ticket,
    noProcesados: productosNoProcesados.map((p) => p.productId),
  };
};