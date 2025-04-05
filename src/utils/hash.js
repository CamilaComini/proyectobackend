const bcrypt = require('bcrypt');

const hashPassword = async (password) => await bcrypt.hash(password, 10);
const comparePassword = async (input, hashed) => await bcrypt.compare(input, hashed);

module.exports = {
  hashPassword,
  comparePassword
};