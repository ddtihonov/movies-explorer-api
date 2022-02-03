const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const AlreadyBeError = require('../errors/AlreadyBeError');
const AuthentificationError = require('../errors/AuthentificationError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .status(200)
        .send({ token });
    })
    .catch(next);
};

const deleteAuth = (req, res) => {
  res
    .clearCookie('token', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'None',
    })
    .send({ message: 'Авторизация отменена!' });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password || password.length < 6) {
    throw new AuthentificationError('Неправильные почта или пароль');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(200).send({
      user: {
        name, email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Введены некорректиные данные'));
      }
      if (err.code === 11000) {
        next(new AlreadyBeError('Пользователь с таким email уже зарегестрирован'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyBeError('Пользователь с таким e-mail уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные!'));
      } else if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные!'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserById,
  createUser,
  updateUserInfo,
  login,
  deleteAuth,
};
