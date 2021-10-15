process.env.NODE_ENV === 'production' || require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

// Search movie by name.
app.get('/api/v1/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const page = req.query.page || 1;

  try {
    const result = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${searchTerm}&language=en-US&page=${page}`
    );
    const data = result.data;
    const processedData = {
      ...data,
      results: data.results.map(e => ({
        title: e.title,
        id: e.id
      }))
    };
    res.json(processedData);
  } catch (err) {
    console.error(err);
  }
});

// Get movie info details.
app.get('/api/v1/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const info = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=en-US`
    );
    const credits = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY}&language=en-US`
    );

    const infoData = info.data;
    const creditData = credits.data;

    const processedData = {
      adult: infoData.adult,
      actors: creditData.cast.map(e => ({
        character: e.character,
        id: e.id,
        name: e.name,
        profile_path: e.profile_path
      })),
      backdrop_path: infoData.backdrop_path,
      budget: infoData.budget,
      directors: creditData.crew
        .filter(e => e.job === 'Director')
        .map(e => e.name),
      genres: infoData.genres.map(e => e.name),
      id: infoData.id,
      original_language: infoData.original_language,
      original_title: infoData.original_title,
      overview: infoData.overview,
      popularity: infoData.popularity,
      poster_path: infoData.poster_path,
      production_companies: infoData.production_companies.map(e => ({
        id: e.id,
        logo_path: e.logo_path,
        name: e.name
      })),
      release_date: infoData.release_date,
      revenue: infoData.revenue,
      runtime: infoData.runtime,
      status: infoData.status,
      title: infoData.title,
      vote_average: infoData.vote_average,
      vote_count: infoData.vote_count
    };

    res.json(processedData);
  } catch (err) {
    console.error(err);
  }
});

// Get actor info details
app.get('/api/v1/actor/:actorId', async (req, res) => {
  const actorId = req.params.actorId;

  try {
    const info = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.API_KEY}&language=en-US`
    );
    const movieCredit = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${process.env.API_KEY}&language=en-US`
    );

    const infoData = info.data;
    const movieData = movieCredit.data.cast;

    const processedData = {
      biography: infoData.biography,
      birthday: infoData.birthday,
      deathday: infoData.deathday,
      gender: ['other', 'female', 'male'][infoData.gender],
      id: infoData.id,
      movies: movieData.map(e => ({
        id: e.id,
        title: e.title,
        poster_path: e.poster_path
      })),
      name: infoData.name,
      place_of_birth: infoData.place_of_birth,
      popularity: infoData.popularity,
      profile_path: infoData.profile_path
    };

    res.json(processedData);
  } catch (err) {
    console.error(err);
  }
});

app.get('/api/v1/genres', async (req, res) => {
  try {
    const result = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`
    );

    res.json(result.data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => console.log('Server is listening on port 3000.'));
