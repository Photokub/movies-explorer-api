const router = require('express').Router();

const { getMovies, saveMovie, deleteMovie, getCurrentMovie } = require('../controllers/movies');

const { validateMovieCreation, validateMovieId } = require('../middlewares/validators');

router.get('/', getMovies);
router.post('/', validateMovieCreation, saveMovie);
router.delete('/:movieId ', deleteMovie);
router.get('/:id ', getCurrentMovie);
//router.delete('/:_id ', validateMovieId, deleteMovie);

module.exports = router;
