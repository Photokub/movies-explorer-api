const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

const UnauthorizedErr = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedErr('Ошибка авторизации'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedErr('Ошибка авторизации'));
    return;
  }

  req.user = {_id: payload._id};

  next();
};
