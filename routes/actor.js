const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');
const Movie = require('../models/movie');

// Get a single actor.
router.get('/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  try {
    res.json(await Actor.findById(actorId));
  } catch (err) {
    res.json(err).status(500);
  }
});

// Get a single actor detail.
router.get('/:actorId/detail', async (req, res) => {
  const actorId = req.params.actorId;

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

// Create a new actor.
router.post('/', async (req, res) => {
  const {
    _id,
    gender,
    biography,
    birthday,
    deathday,
    name,
    place_of_birth,
    popularity,
    profile_path
  } = req.body;

  try {
    await new Actor({
      _id,
      gender,
      biography,
      birthday,
      deathday,
      name,
      place_of_birth,
      popularity,
      profile_path
    }).save();

    res.json(`Inserted the actor with actorId: ${req.body._id}`);
  } catch (err) {
    res.json(err).status(500);
  }
});

module.exports = router;
