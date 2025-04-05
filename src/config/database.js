const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

console.log('MONGO_URL:', MONGO_URL); // Verifica que esta variable de entorno esté cargando correctamente

if (!MONGO_URL) {
  console.error('❌ MONGO_URL no está definido en el archivo .env');
  process.exit(1); // Detenemos la ejecución si no hay conexión a la DB
}

mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1); // Detenemos el servidor si no se puede conectar a la DB
  });

module.exports = mongoose;