const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const AlreadyBeError = require('../errors/AlreadyBeError');

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
      secure: true,
    })
    .send({ message: 'Авторизация отменена!' });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
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
      throw err;
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(() => {
      throw new NotFoundError('Пользователь не найден');
    })
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
      throw err;
    })
    .catch(next);
};

module.exports = {
  getUserById,
  createUser,
  updateUserInfo,
  login,
  deleteAuth,
};
