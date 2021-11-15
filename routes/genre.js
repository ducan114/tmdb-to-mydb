const express = require('express');
const router = express.Router();

const Genre = require('../models/genre');

router.get('/', async (req, res) => {
  try {
    res.json(await Genre.find());
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
