const movieRouter = require('express').Router();

const {
  createMovie,
  getUserMovies,
  deleteMovie,
} = require('../controllers/movies');

const { validateMovieBody, validateMovieDelete } = require('../middlewares/validations');

movieRouter.post('/', validateMovieBody, createMovie);
movieRouter.get('/', getUserMovies);
movieRouter.delete('/_id', validateMovieDelete, deleteMovie);

module.exports = movieRouter;
