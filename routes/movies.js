const router = require('express').Router();

const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies');

const { validateMovieCreation, validateMovieId } = require('../middlewares/validators');

router.get('/', getMovies);
router.post('/', validateMovieCreation, saveMovie);
router.delete('/:movieid ', validateMovieId, deleteMovie);

module.exports = router;
