const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/puntoLan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

module.exports = mongoose; // Exportamos mongoose para usarlo en otros archivos
