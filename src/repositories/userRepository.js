const MongoUserDao = require('../dao/MongoUserDao');

const dao = new MongoUserDao();

class UserRepository {
  create = (userData) => dao.create(userData);
  getByEmail = (email) => dao.getByEmail(email);
  getById = (id) => dao.getById(id);
}

module.exports = UserRepository;