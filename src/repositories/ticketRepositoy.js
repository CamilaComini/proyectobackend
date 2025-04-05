import MongoTicketDao from '../dao/MongoTicketDao.js';
import TicketDTO from '../dto/TicketDTO.js';

const dao = new MongoTicketDao();

export default class TicketRepository {
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