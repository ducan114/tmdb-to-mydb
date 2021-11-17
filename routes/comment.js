const express = require('express');
const firebase = require('../firebase');

const router = express.Router();

const Comment = require('../models/comment');

router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  if (!movieId) {
    res.status(400).send('You must specify a movie id');
    return;
  }

  try {
    const comments = await Comment.find({ movie_id: movieId });
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
    res.json(err.message).status(500);
  }
});

router.post('/', async (req, res) => {
  const { uid, movie_id, content } = req.body;

  try {
    await new Comment({ uid, movie_id, content, createdAt: new Date() }).save();

    res.json('New comment added');
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
