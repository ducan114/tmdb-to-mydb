const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
  adult: {
    type: Boolean,
    required: true
  },
  actors: [
    {
      character: {
        type: String,
        required: true
      },
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      profile_path: String
    }
  ],
  backdrop_path: String,
  budget: {
    type: Number,
    required: true
  },
  directors: [String],
  genres: [String],
  id: {
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
  production_companies: [
    {
      id: {
        type: Number,
        required: true
      },
      logo_path: String,
      name: {
        type: String,
        required: true
      }
    }
  ],
  release_date: String,
  revenue: Number,
  runtime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  vote_average: {
    type: Number,
    required: true
  },
  vote_count: {
    type: Number,
    required: true
  }
});

module.exports = new mongoose.model('Movie', movieSchema);
