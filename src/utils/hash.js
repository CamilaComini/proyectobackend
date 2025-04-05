import bcrypt from 'bcrypt';

export const hashPassword = async (password) => await bcrypt.hash(password, 10);
export const comparePassword = async (input, hashed) => await bcrypt.compare(input, hashed);