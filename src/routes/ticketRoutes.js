import { Router } from 'express';
import { createTicket } from '../services/ticketService.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';

const router = Router();

router.post('/', jwtMiddleware, async (req, res) => {
  try {
    const ticket = await createTicket(req.body.cartId, req.user.id);
    res.status(201).json({ status: 'success', ticket });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

export default router;