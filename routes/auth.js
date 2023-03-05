const routerAuth = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createUser, login, logOut,
} = require('../controllers/users');

const { validateLogin, validateReg } = require('../middlewares/validators');

routerAuth.post('/signup', validateReg, createUser);
routerAuth.post('/signin', validateLogin, login);
routerAuth.post('/signout', auth, logOut);

module.exports = routerAuth;
