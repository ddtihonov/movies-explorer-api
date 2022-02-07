const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthentificationError = require('../errors/AuthentificationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверный формат почты',
    },
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// проверка почты и пароля
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!password || password.length < 6) {
    throw new AuthentificationError('Неправильные почта или пароль');
  }
  return this.findOne({ email }).select('+password')
    .orFail(() => {
      throw new AuthentificationError('Неправильные почта или пароль');
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new AuthentificationError('Неправильные почта или пароль');
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
