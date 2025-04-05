import UserModel from '../models/user.js';

export default class MongoUserDao {
  create = (data) => UserModel.create(data);
  getByEmail = (email) => UserModel.findOne({ email });
  getById = (id) => UserModel.findById(id);
}