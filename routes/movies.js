const router = require('express').Router();

const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies')

const { validateMovieCreation, validateMovieId } = require('../middlewares/validator')

router.get('/', getMovies);
router.post('/', validateMovieCreation, saveMovie);
 router.delete('/:_id ', validateMovieId, deleteMovie);
//TODO//router.post('/',  saveMovie);
//router.delete('/:_id ', deleteMovie);

module.exports = router;
