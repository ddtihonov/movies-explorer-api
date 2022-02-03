const Movie = require('../models/movie');
const IncorrectDataError = require('../errors/IncorrectDataError');
const AlreadyBeError = require('../errors/AlreadyBeError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Введены некорректиные данные'));
      } else if (err.code === 11000) {
        next(new AlreadyBeError('Этот фильм уже добавлен'));
      } else {
        next(err);
      }
    });
};

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (String(movie.owner) !== req.user._id) {
        next(new AuthorizationError('Нельзя удалить чужой фильм'));
      } else {
        movie.remove()
          .then(() => res.status(200).send(movie))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getUserMovies,
  deleteMovie,
};
