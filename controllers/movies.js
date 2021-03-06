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
    trailer,
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
    trailer,
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
      throw err;
    })
    .catch(next);
};

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      next(err);
      throw err;
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (String(movie.owner) === req.user._id) {
        return movie.remove()
          .then(() => res.status(200).send(movie));
      }
      throw new AuthorizationError('Нельзя удалить чужой фильм');
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getUserMovies,
  deleteMovie,
};
