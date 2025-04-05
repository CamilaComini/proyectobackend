const express = require('express');
const controller = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas públicas
router.get('/', controller.getAllProducts);
router.get('/:pid', controller.getProductById);

// Rutas protegidas (autenticado + admin)
router.post('/', authenticate, authorizeAdmin, controller.createProduct);
router.put('/:pid', authenticate, authorizeAdmin, controller.updateProduct);
router.delete('/:pid', authenticate, authorizeAdmin, controller.deleteProduct);

module.exports = router;