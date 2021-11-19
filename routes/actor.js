const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');
const Movie = require('../models/movie');

// Get a single actor.
router.get('/:actorId', async (req, res) => {
  let actorId = req.params.actorId;

  if (!actorId) return res.status(400).send('You must specify a actor id');

  actorId = +actorId;

  if (!actorId) return res.status(400).send('Actor not found');

  try {
    res.json(await Actor.findById(actorId));
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single actor detail.
router.get('/:actorId/detail', async (req, res) => {
  const actorId = req.params.actorId;

  if (!actorId) return res.status(400).send('You must specify a actor id');

  actorId = +actorId;

  if (!actorId) return res.status(400).send('Actor not found');

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
    res.status(500).json(err);
  }
});

module.exports = router;
