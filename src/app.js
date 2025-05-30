const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport.js');

const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');
const mocksRouter = require('./routes/mocksRouter.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/mocks', mocksRouter);

module.exports = app;