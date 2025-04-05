const Joi = require('joi');
const productService = require('../services/productService');
const ProductDTO = require('../dto/ProductDTO');

// Validación con Joi
const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required(),
  thumbnails: Joi.array().items(Joi.string().uri()),
  status: Joi.boolean()
});

const getAllProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, category, availability } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
    };

    const filter = {};
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (availability) filter.status = availability === 'true';

    const result = await productService.getAllProducts(filter, options);

    res.json({
      status: 'success',
      payload: result.docs.map(prod => new ProductDTO(prod)),
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    res.json({ status: 'success', payload: new ProductDTO(product) });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', error: error.details[0].message });

    const productData = {
      ...req.body,
      owner: req.user?.email || 'admin'
    };

    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ status: 'success', payload: new ProductDTO(newProduct) });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (req.body.id) return res.status(400).json({ status: 'error', error: 'No se puede modificar el ID' });

    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', error: error.details[0].message });

    const updated = await productService.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });

    res.json({ status: 'success', payload: new ProductDTO(updated) });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });

    if (req.user.role !== 'admin' && req.user.email !== product.owner) {
      return res.status(403).json({ status: 'error', message: 'No tienes permisos para eliminar este producto' });
    }

    await productService.deleteProduct(req.params.pid);
    res.json({ status: 'success', message: 'Producto eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};