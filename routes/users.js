const router = require('express').Router();

const { getUserProfile, updateUserData } = require('../controllers/users')

const { validateUserInfo } = require('../middlewares/validator');

router.get('/me', validateUserInfo, getUserProfile);
router.patch('/me', validateUserInfo, updateUserData);
//TODO//router.get('/me',  getUserProfile);
//router.patch('/me',  updateUserData);

module.exports = router;
