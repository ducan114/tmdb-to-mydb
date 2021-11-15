const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');

router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    res.json(await Comment.find({ movie_id: movieId }));
  } catch (err) {
    res.json(err.message).status(500);
  }
});

router.post('/', async (req, res) => {
  const { uid, movie_id, content } = req.body;

  try {
    await new Comment({ uid, movie_id, content }).save();

    res.json('New comment added');
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
