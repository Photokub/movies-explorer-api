const router = require('express').Router();

const { getUserProfile, updateUserData } = require('../controllers/users')

router.get('/users/me', getUserProfile);
router.patch('/users/me', updateUserData);

module.exports = router;