const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');
const Actor = require('../models/actor');

// Get popular movies.
router.get('/popular', async (req, res) => {
  const page = req.body.page || 1;
  const limit = req.body.limit || 20;

  try {
    const [data, total] = await Promise.all([
      Movie.find()
        .sort({ popularity: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Movie.countDocuments()
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

// Get a single movie detail.
router.get('/:movieId/detail', async (req, res) => {
  const movieId = req.params.movieId;

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
    res.json(err.message).status(500);
  }
});

// Create a new movie.
router.post('/', async (req, res) => {
  const {
    adult,
    actors,
    backdrop_path,
    budget,
    directors,
    genres,
    _id,
    original_language,
    original_title,
    overview,
    popularity,
    poster_path,
    release_date,
    revenue,
    runtime,
    status,
    tagline,
    title,
    vote_average,
    vote_count
  } = req.body;

  try {
    await new Movie({
      adult,
      actors,
      backdrop_path,
      budget,
      directors,
      genres,
      _id,
      original_language,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      revenue,
      runtime,
      status,
      tagline,
      title,
      vote_average,
      vote_count
    }).save();

    res.json(`Inserted the movie with movieId: ${req.body._id}`);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
