const NotFoundError  = require('../errors/not-found-err');

module.exports.notFoundError = (req, res, next) => next(new NotFoundError('404 Старница не найдена'));
