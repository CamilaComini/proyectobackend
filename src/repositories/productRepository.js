import MongoProductDao from '../dao/MongoProductDao.js';

const dao = new MongoProductDao();

export default class ProductRepository {
  getAllProducts = () => dao.getAll();
  getProductById = (id) => dao.getById(id);
  createProduct = (data) => dao.create(data);
  updateProduct = (id, data) => dao.update(id, data);
  deleteProduct = (id) => dao.delete(id);
}