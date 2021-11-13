const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.themoviedb.org/3/';

// Get poppular movies.
router.get('/movie/popular', async (req, res) => {
  const page = req.query.page || 1;

  try {
    const [id, ...rest] = await axios
      .get(
        `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
      )
      .then(result => result.data);
    res.json({ _id: id, ...rest });
  } catch (err) {
    res.json(err.message);
  }
});

// Search tmdb for movies by name.
router.get('/movie/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const page = req.query.page || 1;

  try {
    const [id, ...rest] = await axios
      .get(
        `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&language=en-US&page=${page}`
      )
      .then(result => result.data);
    res.json({ _id: id, ...rest });
  } catch (err) {
    res.json(err.message);
  }
});

// Get tmdb's single movie info.
router.get('/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const [info, credits] = await Promise.all([
      axios.get(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`),
      axios.get(
        `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
      )
    ]).then(arr => arr.map(e => e.data));

    const processedData = {
      adult: info.adult,
      actors: credits.cast.map(e => ({
        character: e.character,
        _id: e.id,
        name: e.name,
        profile_path: e.profile_path,
        order: e.order
      })),
      backdrop_path: info.backdrop_path,
      budget: info.budget,
      directors: credits.crew
        .filter(e => e.job === 'Director')
        .map(e => e.name),
      genres: info.genres.map(e => e.id),
      _id: info.id,
      original_language: info.original_language,
      original_title: info.original_title,
      overview: info.overview,
      popularity: info.popularity,
      poster_path: info.poster_path,
      release_date: info.release_date,
      revenue: info.revenue,
      runtime: info.runtime,
      status: info.status,
      tagline: info.tagline,
      title: info.title,
      vote_average: info.vote_average,
      vote_count: info.vote_count
    };

    res.json(processedData);
  } catch (err) {
    res.json(err.message);
  }
});

// Get tmdb's single actor info.
router.get('/actor/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  try {
    const [info, credits] = await Promise.all([
      axios.get(
        `${API_URL}person/${actorId}?api_key=${API_KEY}&language=en-US`
      ),
      axios.get(
        `${API_URL}person/${actorId}/movie_credits?api_key=${API_KEY}&language=en-US`
      )
    ]).then(arr => arr.map(e => e.data));

    const processedData = {
      biography: info.biography,
      birthday: info.birthday,
      deathday: info.deathday,
      gender: info.gender,
      _id: info.id,
      movies: credits.cast.map(e => ({
        backdrop_path: e.backdrop_path,
        _id: e.id,
        title: e.title,
        poster_path: e.poster_path,
        popularity: e.popularity
      })),
      name: info.name,
      place_of_birth: info.place_of_birth,
      popularity: info.popularity,
      profile_path: info.profile_path
    };

    res.json(processedData);
  } catch (err) {
    res.json(err.message);
  }
});

// Get all tmdb's genres.
router.get('/genres', async (req, res) => {
  try {
    res.json(
      await axios
        .get(`${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`)
        .then(result => result.data)
    );
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
