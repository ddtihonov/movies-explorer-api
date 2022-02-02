const router = require('express').Router();
const { validateUserCreate, validateUserLogin } = require('../middlewares/validations');
const NotFoundError = require('../errors/NotFoundError');
const {
  login,
  createUser,
} = require('../controllers/users');

router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserLogin, login);

// переход на несуществующий роут
router.use((req, res, next) => {
  next(new NotFoundError('Нет такой страницы'));
});

module.exports = router;
