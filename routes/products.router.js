const express = require('express');
const router = express.Router();

// Rutas base para productos
router.get('/', (req, res) => {
    res.send('Listado de productos');
});

module.exports = router;
