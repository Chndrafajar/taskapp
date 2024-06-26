const mongoose = require('mongoose');

const projectModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  }
);

const projectdb = new mongoose.model('project', projectModel);

module.exports = projectdb;
