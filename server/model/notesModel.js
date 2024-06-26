const mongoose = require('mongoose');

const notesModel = new mongoose.Schema(
  {
    project: {
      type: mongoose.ObjectId,
      ref: 'project',
      required: true,
    },
    fitur: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'New',
      enum: ['New', 'Progress', 'Done'],
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

const notedb = new mongoose.model('note', notesModel);

module.exports = notedb;
