const express = require('express');
const firebase = require('../firebase');

const router = express.Router();

const Comment = require('../models/comment');

router.get('/:movieId', async (req, res) => {
  let movieId = req.params.movieId;

  if (!movieId) return res.status(400).send('You must specify a movie id');

  movieId = +movieId;

  if (!movieId) return res.status(400).send('Movie id must be a number');

  try {
    const comments = await Comment.find({ movie_id: movieId }).sort({
      createdAt: -1
    });
    const profiles = {};

    const uids = Array.from(new Set(comments.map(comment => comment.uid)));

    const usersResp = await Promise.all(
      uids.map(uid => firebase.auth().getUser(uid))
    );

    usersResp.forEach(
      user =>
        (profiles[user.uid] = {
          displayName: user.displayName,
          photoURL: user.photoURL
        })
    );

    res.json({
      comments,
      profiles
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post('/', async (req, res) => {
  const { uid, content } = req.body;
  let { movie_id } = req.body;

  if (!movie_id) return res.status(400).send('You must specify a movie id');

  movie_id = +movie_id;

  if (!movie_id) return res.status(400).send('Movie id must be a number');

  try {
    await new Comment({ uid, movie_id, content, createdAt: new Date() }).save();

    res.json('New comment added');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
