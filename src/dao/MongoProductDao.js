import ProductModel from '../models/product.js';

export default class MongoProductDao {
  getById = (id) => ProductModel.findById(id);
  getAll = () => ProductModel.find();
  create = (data) => ProductModel.create(data);
}