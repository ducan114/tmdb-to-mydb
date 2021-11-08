const mongoose = require('mongoose');
const actorSchema = new mongoose.Schema({
  biography: String,
  birthday: String,
  deathday: String,
  gender: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  movies: [
    {
      id: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      poster_path: String
    }
  ],
  name: {
    type: String,
    required: true
  },
  place_of_birth: String,
  popularity: {
    type: Number,
    required: true
  },
  profile_path: String,
  updatedAt: {
    type: Date,
    required: true
  }
});

module.exports = new mongoose.model('Actor', actorSchema);
