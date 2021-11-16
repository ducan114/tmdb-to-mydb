process.env.NODE_ENV === 'production' || require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const db = mongoose.connection;

const app = express();
const port = process.env.PORT || 3000;

const externalRouter = require('./routes/external');
const movieRouter = require('./routes/movie');
const actorRouter = require('./routes/actor');
const importRouter = require('./routes/import');
const genreRouter = require('./routes/genre');
const commentRouter = require('./routes/comment');

// Setup server.
app.use(cors());
app.use(express.json());
app.use('/api/v1/external', externalRouter);
app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/actor', actorRouter);
app.use('/api/v1/import', importRouter);
app.use('/api/v1/genre', genreRouter);
app.use('/api/v1/comment', commentRouter);

// Setup database.
mongoose.connect(process.env.DB_URL);

// Start server after connecting to db.
db.once('open', () => {
  console.log('Connected to database.');
  app.listen(port, () => console.log(`Server is listening on port ${port}.`));
});

db.on('error', err => {
  console.error(err);
});
