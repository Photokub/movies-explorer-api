const router = require('express').Router();

const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies')

router.get('/movies', getMovies);
router.post('/movies', saveMovie);
router.delete('/movies/_id ', deleteMovie);