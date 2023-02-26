const routerAuth = require('express').Router();
const {
  createUser, login, logOut,
} = require('../controllers/users');

const { validateLogin, validateReg} = require('../middlewares/validator');

routerAuth.post('/signup', validateReg, createUser);
routerAuth.post('/signin', validateLogin, login);
//routerAuth.post('/signup', createUser);
routerAuth.post('/signin', login);
//TODO//routerAuth.post('/logout', logOut);

module.exports = routerAuth;

// app.use('/signup', createUser)
