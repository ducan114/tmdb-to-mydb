const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');

// Get a single actor.
router.get('/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  try {
    res.json(await Actor.findById(actorId));
  } catch (err) {
    res.json(err).status(500);
  }
});

// Create a new actor.
router.post('/', async (req, res) => {
  try {
    await new Actor(req.body).save();

    res.json(`Inserted the actor with actorId: ${req.body._id}`);
  } catch (err) {
    res.json(err).status(500);
  }
});

module.exports = router;
