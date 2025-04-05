import MongoCartDao from '../dao/MongoCartDao.js';
const dao = new MongoCartDao();

export default class CartRepository {
  getById = (id) => dao.getById(id);
  addItem = (cartId, productId, quantity) => dao.addItem(cartId, productId, quantity);
  removeItem = (cartId, productId) => dao.removeItem(cartId, productId);
  clear = (cartId) => dao.clear(cartId);
}