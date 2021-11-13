const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true }
});

module.exports = new mongoose.model('Genre', genreSchema);
