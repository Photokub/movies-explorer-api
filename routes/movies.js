const router = require('express').Router();

const { getMovies, saveMovie, deleteMovie} = require('../controllers/movies');

const { validateMovieCreation, validateMovieId } = require('../middlewares/validators');

router.get('/', getMovies);
router.post('/', validateMovieCreation, saveMovie);
router.delete('/:_id ', deleteMovie);
//router.get('/:id ', getCurrentMovie);
//router.get('/:id ', paramsTest);
app.get('/:id', (req, res) => {
    res.send(req.params);  
  });
//router.delete('/:_id ', validateMovieId, deleteMovie);

module.exports = router;
