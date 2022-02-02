const router = require('express').Router();

const {
  getUserById,
  updateUserInfo,
} = require('../controllers/users');

const { validateUserUpdate } = require('../middlewares/validations');

router.get('/me', getUserById);
router.patch('/me', validateUserUpdate, updateUserInfo);

module.exports = router;
