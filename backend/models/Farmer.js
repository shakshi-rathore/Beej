const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  uid: String,
  name: String,
  location: String,
  language: String,
  landSize: String,
  cropType: String,
  irrigation: String,
  profilePic: String
});

module.exports = mongoose.model('Farmer', farmerSchema);
