const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');
const Movie = require('../models/movie');

// Get a single actor.
router.get('/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  if (!actorId) {
    res.status(400).send('You must specify a actor id');
    return;
  }

  try {
    res.json(await Actor.findById(actorId));
  } catch (err) {
    res.json(err).status(500);
  }
});

// Get a single actor detail.
router.get('/:actorId/detail', async (req, res) => {
  const actorId = req.params.actorId;

  if (!actorId) {
    res.status(400).send('You must specify a actor id');
    return;
  }

  try {
    const [actor, movies] = await Promise.all([
      Actor.findById(actorId),
      Movie.find({ 'actors._id': actorId })
    ]);

    res.json({
      ...actor._doc,
      movies
    });
  } catch (err) {
    res.json(err).status(500);
  }
});

module.exports = router;
