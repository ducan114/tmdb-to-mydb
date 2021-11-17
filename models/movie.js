const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  adult: {
    type: Boolean,
    required: true
  },
  actors: [
    {
      character: String,
      _id: {
        type: Number,
        required: true
      },
      order: {
        type: Number,
        required: true
      }
    }
  ],
  backdrop_path: String,
  budget: {
    type: Number,
    required: true
  },
  directors: [String],
  genres: [Number],
  _id: {
    type: Number,
    required: true
  },
  original_language: {
    type: String,
    required: true
  },
  original_title: {
    type: String,
    required: true
  },
  overview: String,
  popularity: {
    type: Number,
    required: true
  },
  poster_path: String,
  release_date: String,
  revenue: {
    type: Number,
    required: true
  },
  runtime: Number,
  status: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tagline: String,
  vote_average: {
    type: Number,
    required: true,
    default: 0
  },
  vote_count: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = new mongoose.model('Movie', movieSchema);
