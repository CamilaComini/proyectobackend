const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  species: String,
  age: Number
});

module.exports = mongoose.model('Pet', petSchema);