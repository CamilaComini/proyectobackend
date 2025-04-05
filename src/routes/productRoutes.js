import { Router } from 'express';
import * as controller from '../controllers/productsController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', controller.getAllProducts); // Productos con paginación, filtros y ordenamiento
router.get('/:pid', controller.getProductById); // Obtener un producto por ID

// Rutas protegidas (sólo para admin)
router.post('/', authMiddleware('admin'), controller.createProduct);
router.put('/:pid', authMiddleware('admin'), controller.updateProduct);
router.delete('/:pid', authMiddleware('admin'), controller.deleteProduct);

export default router;
