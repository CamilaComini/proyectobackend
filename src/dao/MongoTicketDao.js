import TicketModel from '../models/ticket.js';

export default class MongoTicketDao {
  create = (ticketData) => TicketModel.create(ticketData);
  getById = (id) => TicketModel.findById(id);
}