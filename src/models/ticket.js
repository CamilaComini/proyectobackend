const mongoose = require('../config/database.js'); // Usar conexión centralizada
const { v4: uuidv4 } = require('uuid');

// Esquema del ticket
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: uuidv4
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

// Verifica si el modelo ya existe para evitar sobreescritura
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;