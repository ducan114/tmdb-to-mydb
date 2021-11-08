const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');

// Get a single actor.
router.get('/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  try {
    res.json(await Actor.find({ id: actorId }));
  } catch (err) {
    res.json(err);
  }
});

// Create a new actor.
router.post('/', async (req, res) => {
  try {
    const actor = new Actor({
      ...req.body,
      updatedAt: new Date()
    });

    await actor.save();

    res.json('New actor added.');
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
