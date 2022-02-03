const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный формат ccылки');
  }
  return value;
};

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .message('Hекорректное имя пользователя'),
    email: Joi.string().required().email()
      .message('Hекорректный email'),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Hекорректные имя пользователя или email'),
    password: Joi.string().required().min(6)
      .message('Hекорректные имя пользователя или email'),
  }),
});

const validateUserCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .message('Hекорректное имя пользователя'),
    email: Joi.string().required().email()
      .message('Hекорректный email'),
    password: Joi.string().required().min(6)
      .message('Hекорректный password'),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidation),
    trailerLink: Joi.string().required().custom(urlValidation),
    thumbnail: Joi.string().required().custom(urlValidation),
    id: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieDelete = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateUserUpdate,
  validateUserLogin,
  validateUserCreate,
  validateMovieBody,
  validateMovieDelete,
};
