const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Crear el esquema del usuario
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', // Referencia al modelo de Carts
  },
  role: {
    type: String,
    default: 'user',
  },
});

// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Crear un "salt"
  this.password = await bcrypt.hash(this.password, salt); // Encriptar la contraseña
  next();
});

// Método para comparar contraseñas (utilizado para login)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Comparar la contraseña con el hash
};

const User = mongoose.model('User', userSchema);

module.exports = User;
