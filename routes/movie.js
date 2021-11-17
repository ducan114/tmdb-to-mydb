const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');
const Actor = require('../models/actor');

// Get popular movies.
router.get('/popular', async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const genres = req.query.genre;
  const query = {};

  genres && (query.genres = { $all: [...genres] });

  try {
    const [data, total] = await Promise.all([
      Movie.find(query)
        .sort({ popularity: -1 })
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
    res.status(500).json(err.message);
  }
});

// Search movies by name.
router.get('/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    res.status(400).send('You must specify a search term');
    return;
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const genres = req.query.genre;

  const query = { $text: { $search: searchTerm } };

  genres && (query.genres = { $all: [...genres] });

  try {
    const [data, total] = await Promise.all([
      Movie.find(query)
        .sort({ score: { $meta: 'textScore' }, popularity: -1 })
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
    res.status(500).json(err.message);
  }
});

// Get a single movie.
router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  if (!movieId) {
    res.status(400).send('You must specify a movie id');
    return;
  }

  try {
    res.json(await Movie.findById(movieId));
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get a single movie detail.
router.get('/:movieId/detail', async (req, res) => {
  const movieId = req.params.movieId;

  if (!movieId) {
    res.status(400).send('You must specify a movie id');
    return;
  }

  try {
    const { _doc: movie } = await Movie.findById(movieId);

    const actorsResp = await Actor.find({
      _id: { $in: movie.actors.map(actor => actor._id) }
    });

    const actors = actorsResp.map((actor, index) => ({
      ...actor._doc,
      ...movie.actors.sort((a, b) => a._id - b._id)[index]._doc
    }));

    res.json({
      ...movie,
      actors: actors.sort((a, b) => a.order - b.order)
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
