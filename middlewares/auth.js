const jwt = require('jsonwebtoken');
const AuthentificationError = require('../errors/AuthentificationError');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    payload = jwt.verify(
      req.cookies.token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new AuthentificationError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
