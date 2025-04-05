const UserModel = require('../models/user');

class MongoUserDao {
  create(data) {
    return UserModel.create(data);
  }

  getByEmail(email) {
    return UserModel.findOne({ email });
  }

  getById(id) {
    return UserModel.findById(id);
  }
}

module.exports = MongoUserDao;