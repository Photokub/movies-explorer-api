const router = require('express').Router();

const { getUserProfile, updateUserData } = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/validators');

router.get('/me', validateUserInfo, getUserProfile);
router.patch('/me', validateUserInfo, updateUserData);

module.exports = router;
