const userRouter = require('express').Router();

const {
  getUserById,
  updateUserInfo,
} = require('../controllers/users');

const { validateUserUpdate } = require('../middlewares/validations');

userRouter.get('/me', getUserById);
userRouter.patch('/me', validateUserUpdate, updateUserInfo);

module.exports = userRouter;
