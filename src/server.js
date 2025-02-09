const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const productsRouter = require('./routes/products.router'); // Ruta de productos
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Inicializar socket.io

// Configuración de Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Definir la lista de productos
let productos = [
    { id: '1', title: 'Consola Gamer Mi Stick Tv', price: 60.000 },
    { id: '2', title: 'Celular Iphone 13', price: 600.000 },
    { id: '3', title: 'Auriculares Inalambricos D35', price: 27.000 }
];

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// WebSocket para actualizar productos en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Emitir productos al cliente
    socket.emit('productos', productos);

    // Recibir productos creados o eliminados
    socket.on('nuevoProducto', (producto) => {
        productos.push(producto);
        io.emit('productos', productos);
    });

    socket.on('eliminarProducto', (id) => {
        productos = productos.filter(producto => producto.id !== id);
        io.emit('productos', productos);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});