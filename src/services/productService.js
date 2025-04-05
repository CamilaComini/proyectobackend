const ProductRepository = require('../repositories/productRepository');

const productRepo = new ProductRepository();

const getAllProducts = async () => productRepo.getAllProducts();
const getProductById = async (id) => productRepo.getProductById(id);
const createProduct = async (data) => productRepo.createProduct(data);
const updateProduct = async (id, data) => productRepo.updateProduct(id, data);
const deleteProduct = async (id) => productRepo.deleteProduct(id);

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};