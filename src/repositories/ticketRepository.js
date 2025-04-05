const MongoTicketDao = require('../dao/MongoTicketDao');
const TicketDTO = require('../dto/TicketDTO');

const dao = new MongoTicketDao();

class TicketRepository {
  create = async (data) => {
    if (!(data instanceof TicketDTO)) {
      throw new Error('Los datos del ticket deben ser una instancia de TicketDTO');
    }
    return await dao.create(data);
  };

  getById = async (id) => {
    return await dao.getById(id);
  };
}

module.exports = TicketRepository;