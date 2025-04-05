import ProductRepository from '../repositories/productRepository.js';

const productRepo = new ProductRepository();

export const getAllProducts = async () => productRepo.getAllProducts();
export const getProductById = async (id) => productRepo.getProductById(id);
export const createProduct = async (data) => productRepo.createProduct(data);
export const updateProduct = async (id, data) => productRepo.updateProduct(id, data);
export const deleteProduct = async (id) => productRepo.deleteProduct(id);