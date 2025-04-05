const express = require('express');
const { createTicket } = require('../services/ticketService');
const { jwtMiddleware } = require('../middleware/jwtMiddleware');

const router = express.Router();

router.post('/', jwtMiddleware, async (req, res) => {
  try {
    const ticket = await createTicket(req.body.cartId, req.user.id);
    res.status(201).json({ status: 'success', ticket });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

module.exports = router;