const MongoCartDao = require('../dao/MongoCartDao');
const dao = new MongoCartDao();

class CartRepository {
  getById = (id) => dao.getById(id);
  addItem = (cartId, productId, quantity) => dao.addItem(cartId, productId, quantity);
  removeItem = (cartId, productId) => dao.removeItem(cartId, productId);
  clear = (cartId) => dao.clear(cartId);
}

module.exports = CartRepository;