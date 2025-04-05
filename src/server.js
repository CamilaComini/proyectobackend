const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const passport = require('./config/passport');
const mongoose = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware');
const jwt = require('./utils/jwt');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const Product = require('./models/product'); // Modelo para WebSocket
require('dotenv').config();

// Inicialización
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Middlewares globales
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(errorMiddleware);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API REST
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);

// Rutas para vistas
app.get('/', (req, res) => res.render('index'));
app.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'));

// WebSocket para productos en tiempo real
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    // Emitir productos existentes
    const productos = await Product.find();
    socket.emit('productos', productos);

    socket.on('nuevoProducto', async (data) => {
        try {
            const nuevo = new Product(data);
            await nuevo.save();
            const productosActualizados = await Product.find();
            io.emit('productos', productosActualizados);
        } catch (error) {
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('eliminarProducto', async (id) => {
        try {
            await Product.findByIdAndDelete(id);
            const productosActualizados = await Product.find();
            io.emit('productos', productosActualizados);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});