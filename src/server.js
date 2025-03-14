const express = require('express');
const Product = require('./models/product');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const mongoose = require('./config/database'); 
const productsRouter = require('./routes/products.router'); // Ruta de productos
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Inicializar socket.io
const errorMiddleware = require('./middleware/errorMiddleware');
const passport = require('./config/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Configuración de Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Middlewares
app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser()); 
app.use(passport.initialize());

// Archivos estáticos (si tienes CSS, JS, etc. en una carpeta public)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/products', productsRouter);

// Ruta para la vista principal (index)
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para la vista en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// WebSocket para actualizar productos en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Emitir productos al cliente
    Product.find().then((productos) => {
        socket.emit('productos', productos);
    });

    // Recibir productos creados o eliminados
    socket.on('nuevoProducto', async (producto) => {
        try {
            if (!producto || !producto.title || !producto.price || isNaN(producto.price) || producto.price <= 0) {
                socket.emit('error', 'Producto inválido. Asegúrate de enviar un título y un precio válido.');
                return;
            }

            // Guardar en la base de datos
            const newProduct = new Product(producto);
            await newProduct.save();

            // Emitir los productos actualizados
            const productos = await Product.find();
            io.emit('productos', productos);
        } catch (err) {
            socket.emit('error', 'Error al agregar el producto.');
            console.error(err);
        }
    });

    socket.on('eliminarProducto', async (id) => {
        try {
            const producto = await Product.findByIdAndDelete(id);
            if (!producto) {
                socket.emit('error', 'Producto no encontrado.');
                return;
            }

            const productos = await Product.find();
            io.emit('productos', productos);
        } catch (err) {
            socket.emit('error', 'Error al eliminar el producto.');
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionsRoutes');

app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);


// Ruta para obtener el usuario actual (basado en el JWT)
app.get('/api/sessions/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user); // Devuelve los datos del usuario
  });
  
  // Ruta de login (login con JWT)
  app.post('/api/sessions/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: info.message || 'Algo salió mal' });
      }
  
      // Generar JWT
      const payload = { id: user._id };
      const token = jwt.sign(payload, 'clave_secreta', { expiresIn: '1h' });
  
      return res.json({ user, token });
    })(req, res, next);
  });
  
// Iniciar servidor
require('./config/database'); // Importamos la conexión a la base de datos
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});