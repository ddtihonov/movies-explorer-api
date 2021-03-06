const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { validateUserCreate, validateUserLogin } = require('../middlewares/validations');
const NotFoundError = require('../errors/NotFoundError');
const {
  login,
  createUser,
  deleteAuth,
} = require('../controllers/users');

// роуты, не требующие авторизации
router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserLogin, login);
router.use(auth);
// роуты требующие авторизации
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.delete('/signout', deleteAuth);

// переход на несуществующий роут
router.use((req, res, next) => {
  next(new NotFoundError('Нет такой страницы'));
});

module.exports = router;
