const Product = require('../models/product'); // Importar el modelo de productos
const Joi = require('joi');

// Esquema de validación para un producto
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

const getProducts = async (req, res) => {
  try {
    const { category, available, sortByPrice } = req.query;
    
    let query = {};
    
    // Filtrar por categoría
    if (category) {
      query.category = category;
    }

    // Filtrar por disponibilidad
    if (available) {
      query.available = available === 'true';  // Esto asume que 'available' es un booleano
    }

    // Ordenar por precio
    let sort = {};
    if (sortByPrice) {
      sort.price = sortByPrice === 'asc' ? 1 : -1;  // Ascendente o descendente
    }

    const products = await Product.find(query).sort(sort);
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// Obtener todos los productos con paginación, filtrado y ordenamiento
const getAllProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, category, availability } = req.query;

    // Convertir valores a numéricos si es necesario
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    };

    // Filtrar por categoría y disponibilidad
    let filter = {};
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (availability) {
      filter.status = availability === 'true';
    }

    // Obtener productos con paginación y filtros
    const result = await Product.paginate(filter, options);

    res.json({
      status: 'success',
      payload: result.docs,
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

// Obtener un producto por ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
  try {
    // Validar los datos entrantes
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', error: error.details[0].message });
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto por ID
const updateProduct = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.id) {
      return res.status(400).json({ status: 'error', error: 'No se puede actualizar el ID del producto' });
    }

    // Validar los datos entrantes
    const { error } = productSchema.validate(updates);
    if (error) {
      return res.status(400).json({ status: 'error', error: error.details[0].message });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
    res.json({ status: 'success', message: 'Producto eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
