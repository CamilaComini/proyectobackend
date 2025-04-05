const TicketModel = require('../models/ticket');

class MongoTicketDao {
  create(ticketData) {
    return TicketModel.create(ticketData);
  }

  getById(id) {
    return TicketModel.findById(id);
  }
}

module.exports = MongoTicketDao;