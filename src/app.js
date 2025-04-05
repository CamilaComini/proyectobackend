import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);

export default app;