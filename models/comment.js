const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  movie_id: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = new mongoose.model('Comment', commentSchema);
