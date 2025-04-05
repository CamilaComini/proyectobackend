import MongoUserDao from '../dao/MongoUserDao.js';
const dao = new MongoUserDao();

export default class UserRepository {
  create = (userData) => dao.create(userData);
  getByEmail = (email) => dao.getByEmail(email);
  getById = (id) => dao.getById(id);
}