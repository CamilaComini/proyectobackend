class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    if (user.status) this.status = user.status;
  }
}

module.exports = UserDTO;