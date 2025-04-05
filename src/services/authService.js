import UserRepository from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import UserDTO from '../dto/UserDTO.js';

const userRepository = new UserRepository();

export const registerUser = async (userData) => {
  const existing = await userRepository.getByEmail(userData.email);
  if (existing) throw new Error('Usuario ya registrado');
  userData.password = await hashPassword(userData.password);
  const user = await userRepository.create(userData);
  return new UserDTO(user);
};

export const loginUser = async (email, password) => {
  const user = await userRepository.getByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');
  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Contraseña incorrecta');
  const token = generateToken({ id: user._id, role: user.role });
  return { token, user: new UserDTO(user) };
};