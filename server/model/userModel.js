const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

const userdb = new mongoose.model('users', userModel);

module.exports = userdb;
