const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');

// Search movies by name.
router.get('/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;

  try {
    const query = { title: new RegExp(searchTerm, 'i') };

    const [data, total] = await Promise.all([
      Movie.find(query)
        .skip((page - 1) * limit)
        .limit(limit),
      Movie.countDocuments(query)
    ]);

    res.json({
      page,
      results: data,
      total_pages: Math.ceil(total / limit),
      total_results: total
    });
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Get a single movie.
router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    res.json(await Movie.findById(movieId));
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Create a new movie.
router.post('/', async (req, res) => {
  try {
    await new Movie(req.body).save();

    res.json(`Inserted the movie with movieId: ${req.body._id}`);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
