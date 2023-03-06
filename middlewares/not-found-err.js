const NotFoundError = require('../errors/not-found-err');

const { PAGE_NOT_FOUND_ERR_MESSAGE } = require('../utils/err-messages')

module.exports.notFoundError = (req, res, next) => next(new NotFoundError(PAGE_NOT_FOUND_ERR_MESSAGE));
