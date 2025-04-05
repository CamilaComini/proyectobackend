import * as TicketService from '../services/ticketService.js';

export const createTicket = async (req, res) => {
  try {
    const ticket = await TicketService.createTicket(req.body.cartId, req.user.id);
    res.status(201).json({ status: 'success', ticket });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};