const { celebrate, Joi } = require('celebrate');

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

module.exports = {
  validateUserUpdate,
  validateUserLogin,
  validateUserCreate,
};
