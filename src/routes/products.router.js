const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Importamos el modelo Product
const productsController = require('../controllers/productsController');

// Rutas de productos
router.get('/', productsController.getAllProducts);  // Obtener todos los productos
router.get('/:pid', productsController.getProductById);  // Obtener un producto por ID
router.post('/', productsController.createProduct);  // Crear un nuevo producto
router.put('/:pid', productsController.updateProduct);  // Actualizar un producto
router.delete('/:pid', productsController.deleteProduct);  // Eliminar un producto

// Ruta GET para obtener productos con filtros, ordenamiento y paginación
router.get('/api/products', async (req, res) => {
  try {
    const { category, availability, sort, page = 1, limit = 10 } = req.query;

    // Construir filtros dinámicamente
    const filters = {};
    if (category) filters.category = category;
    if (availability) filters.availability = availability === 'true';

    // Construir opciones de ordenamiento
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption.price = 1; // Ascendente
    } else if (sort === 'price_desc') {
      sortOption.price = -1; // Descendente
    }

    // Ejecutar consulta con filtros, ordenamiento y paginación
    const products = await Product.find(filters)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

module.exports = router;
