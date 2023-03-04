const router = require('express').Router();

const { getMovies, saveMovie, deleteMovie, paramsTest} = require('../controllers/movies');

const { validateMovieCreation, validateMovieId } = require('../middlewares/validators');

router.get('/', getMovies);
router.post('/', validateMovieCreation, saveMovie);
router.delete('/:_id ', deleteMovie);
//router.get('/:id ', getCurrentMovie);
router.get('/:id ', paramsTest);
//router.delete('/:_id ', validateMovieId, deleteMovie);

module.exports = router;
