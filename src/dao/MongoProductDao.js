const ProductModel = require('../models/product');

class MongoProductDao {
  getById(id) {
    return ProductModel.findById(id);
  }

  getAll() {
    return ProductModel.find();
  }

  create(data) {
    return ProductModel.create(data);
  }
}

module.exports = MongoProductDao;