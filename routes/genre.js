const express = require('express');
const router = express.Router();

const Genre = require('../models/genre');

// Get all genres.
router.get('/', async (req, res) => {
  try {
    res.json(await Genre.find());
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Get a single genre.
router.get('/:genreId', async (req, res) => {
  const genreId = req.params.genreId;

  if (!genreId) {
    res.status(400).send('You must specify a genre id');
    return;
  }

  try {
    res.json(await Genre.findById(genreId));
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
