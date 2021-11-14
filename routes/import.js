const express = require('express');
const axios = require('axios');
const router = express.Router();

const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Genre = require('../models/genre');

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.themoviedb.org/3/';

// Import every infomation that relates to the specified movieId.
router.get('/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    // Get the movie with the given movieId.
    const movieResp = await Promise.all([
      axios.get(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`),
      axios.get(
        `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
      )
    ]);

    const [movieInfo, movieCredits] = movieResp.map(e => e.data);

    // Get the actors who participated in the movie.
    const actorsResp = await Promise.all(
      movieCredits.cast.map(actor =>
        axios.get(
          `${API_URL}person/${actor.id}?api_key=${API_KEY}&language=en-US`
        )
      )
    );

    const actors = actorsResp.map(e => e.data);

    // Insert actors if not exist.
    await Promise.all(
      actors.map(actor =>
        Actor.findOneAndUpdate(
          { _id: actor.id },
          {
            $setOnInsert: {
              _id: actor.id,
              biography: actor.biography,
              birthday: actor.birthday,
              deathday: actor.deathday,
              gender: actor.gender,
              name: actor.name,
              place_of_birth: actor.place_of_birth,
              popularity: actor.popularity,
              profile_path: actor.profile_path
            }
          },
          { upsert: true, new: true }
        )
      )
    );

    // Insert movie.
    await Movie.findOneAndUpdate(
      { _id: movieId },
      {
        $setOnInsert: {
          actors: movieCredits.cast.map(e => ({
            character: e.character,
            _id: e.id,
            order: e.order
          })),
          adult: movieInfo.adult,
          backdrop_path: movieInfo.backdrop_path,
          budget: movieInfo.budget,
          directors: movieCredits.crew
            .filter(e => e.job === 'Director')
            .map(e => e.name),
          genres: movieInfo.genres.map(e => e.id),
          _id: movieInfo.id,
          original_language: movieInfo.original_language,
          original_title: movieInfo.original_title,
          overview: movieInfo.overview,
          popularity: movieInfo.popularity,
          poster_path: movieInfo.poster_path,
          release_date: movieInfo.release_date,
          revenue: movieInfo.revenue,
          runtime: movieInfo.runtime,
          status: movieInfo.status,
          tagline: movieInfo.tagline,
          title: movieInfo.title,
          vote_average: movieInfo.vote_average,
          vote_count: movieInfo.vote_count
        }
      },
      { upsert: true, new: true }
    );

    res.json(`Imported the movie with movieId: ${movieId}`);
  } catch (err) {
    res.json(err.message).status(500);
  }
});

// Import all genres.
router.get('/genres', async (req, res) => {
  try {
    // Get all genres.
    const genresResp = await axios.get(
      `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`
    );

    const genres = genresResp.data.genres.map(genre => ({
      _id: genre.id,
      name: genre.name
    }));

    // Insert all genres.
    await Genre.insertMany(genres);

    res.json('Imported all genres');
  } catch (err) {
    res.json(err.message).status(500);
  }
});

module.exports = router;
