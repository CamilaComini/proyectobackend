const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Puerto configurado
const PORT = 8080; // Cambié el puerto a 8080
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});