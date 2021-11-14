const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.themoviedb.org/3/';

// Get poppular movies.
router.get('/movie/popular', async (req, res) => {
  const page = req.query.page || 1;

  try {
    const resp = await axios.get(
      `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    const data = {
      ...resp.data,
      results: resp.data.results.map(e => {
        const { id, ...rest } = e;

        return {
          _id: id,
          ...rest
        };
      })
    };

    res.json(data);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Search tmdb for movies by name.
router.get('/movie/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const page = req.query.page || 1;

  try {
    const resp = await axios.get(
      `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&language=en-US&page=${page}`
    );

    const data = {
      ...resp.data,
      results: resp.data.results.map(e => {
        const { id, ...rest } = e;

        return {
          _id: id,
          ...rest
        };
      })
    };

    res.json(data);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Get tmdb's single movie info.
router.get('/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const resp = await Promise.all([
      axios.get(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`),
      axios.get(
        `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
      )
    ]);

    const [{ id, genres, ...infoRest }, credits] = resp.map(e => e.data);

    const data = {
      actors: credits.cast.map(e => {
        const { id, ...rest } = e;

        return { _id: id, ...rest };
      }),
      directors: credits.crew
        .filter(e => e.job === 'Director')
        .map(e => e.name),
      genres: genres.map(e => e.id),
      _id: id,
      ...infoRest
    };

    res.json(data);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Get tmdb's single actor info.
router.get('/actor/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  try {
    const resp = await Promise.all([
      axios.get(
        `${API_URL}person/${actorId}?api_key=${API_KEY}&language=en-US`
      ),
      axios.get(
        `${API_URL}person/${actorId}/movie_credits?api_key=${API_KEY}&language=en-US`
      )
    ]);

    const [{ id, ...infoRest }, credits] = resp.map(e => e.data);

    const data = {
      _id: id,
      ...infoRest,
      movies: credits.cast.map(e => {
        const { id, ...rest } = e;

        return {
          _id: id,
          ...rest
        };
      })
    };

    res.json(data);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Get all tmdb's genres.
router.get('/genres', async (req, res) => {
  try {
    const resp = await axios.get(
      `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`
    );

    res.json(resp.data);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
