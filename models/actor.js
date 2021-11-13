const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  biography: String,
  birthday: String,
  deathday: String,
  gender: {
    type: Number,
    required: true
  },
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  place_of_birth: String,
  popularity: {
    type: Number,
    required: true
  },
  profile_path: String
});

module.exports = new mongoose.model('Actor', actorSchema);
