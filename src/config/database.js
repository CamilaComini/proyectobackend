const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (customUri) => {
  const MONGO_URL = customUri || process.env.MONGO_URL;

  console.log('MONGO_URL:', MONGO_URL);

  if (!MONGO_URL) {
    console.error('❌ MONGO_URL no está definido');
    throw new Error('MONGO_URL no está definido'); // ✅ En vez de process.exit(1)
  }

  // ✅ Evitar múltiples conexiones activas
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Conectado a MongoDB');
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      throw error; // ✅ En vez de process.exit(1)
    }
  } else {
    console.log('🔄 Ya hay una conexión activa con MongoDB');
  }
};

module.exports = {
  connectDB,
  mongoose
};