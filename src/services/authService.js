const UserRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const UserDTO = require('../dto/UserDTO');

const userRepository = new UserRepository();

const registerUser = async (userData) => {
  const existing = await userRepository.getByEmail(userData.email);
  if (existing) throw new Error('Usuario ya registrado');
  userData.password = await hashPassword(userData.password);
  const user = await userRepository.create(userData);
  return new UserDTO(user);
};

const loginUser = async (email, password) => {
  const user = await userRepository.getByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');
  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Contraseña incorrecta');
  const token = generateToken({ id: user._id, role: user.role });
  return { token, user: new UserDTO(user) };
};

module.exports = {
  registerUser,
  loginUser
};