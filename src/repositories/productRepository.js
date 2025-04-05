const MongoProductDao = require('../dao/MongoProductDao');
const dao = new MongoProductDao();

class ProductRepository {
  getAllProducts = () => dao.getAll();
  getProductById = (id) => dao.getById(id);
  createProduct = (data) => dao.create(data);
  updateProduct = (id, data) => dao.update(id, data);
  deleteProduct = (id) => dao.delete(id);
}

module.exports = ProductRepository;