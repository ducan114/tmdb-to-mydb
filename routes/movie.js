const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');

// Search movies by name.
router.get('/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;

  try {
    const data = await Movie.find({ title: new RegExp(searchTerm, 'i') })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Movie.countDocuments({
      title: new RegExp(searchTerm, 'i')
    });

    res.json({
      page,
      results: data.map(e => ({
        id: e.id,
        title: e.title,
        poster_path: e.poster_path
      })),
      total_pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.json(err.message);
  }
});

// Get a single movie.
router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    res.json(await Movie.find({ id: movieId }));
  } catch (err) {
    res.json(err.message);
  }
});

// Create a new movie.
router.post('/', async (req, res) => {
  try {
    const movie = new Movie({
      ...req.body,
      updatedAt: new Date()
    });

    await movie.save();

    res.json('New movie added.');
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
