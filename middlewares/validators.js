const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.validateReg = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validateMovieCreation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(300),
    director: Joi.string().required().min(2).max(300),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2).max(3000),
    image: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Введн неверный URL');
        }
        return value;
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Введн неверный URL');
        }
        return value;
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Введн неверный URL');
        }
        return value;
      }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(300),
    nameEN: Joi.string().required().min(2).max(300),
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});