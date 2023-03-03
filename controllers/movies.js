const mongoose = require('mongoose');
const Movie = require('../models/movies');

const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).populate('owner');
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};

const getCurrentMovie = async (req, res, next) => {
  try {
    res.send(req.params)
  } catch (err) {
    return next(err);
  }
};

const saveMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id })
    return res.status(201).send(movie);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestErr('Ошибка валидации'));
    }
    return next(err);
  }
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      console.log(movie)
      if (!movie) {
        throw new NotFoundError('Невозможно найти');
      }
      //if (!movie.owner.equals(movieId)) {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Невозможно удалить');
      }
      movie.remove()
        //.then(() => res.send({ message: 'Фильм удален' })).catch(next);
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestErr('Переданы некорректные данные при создании карточки фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
  getCurrentMovie
};
