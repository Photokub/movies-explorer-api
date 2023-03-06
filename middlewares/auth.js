const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const { UNAUTHORIZED_ERR_MESSAGE } = require('../utils/err-messages')

const UnauthorizedErr = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedErr(UNAUTHORIZED_ERR_MESSAGE));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedErr(UNAUTHORIZED_ERR_MESSAGE));
    return;
  }

  req.user = { _id: payload._id };

  next();
};
