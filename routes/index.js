const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const routerAuth = require('./auth');
const auth = require('../middlewares/auth');
const { notFoundError }  = require('../middlewares/not-found-err');

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);
router.use('/', routerAuth);
router.use('*', notFoundError);
//router.use('*', (req, res, next) => next(new NotFoundError('404 Старница не найдена')));

module.exports = router;

