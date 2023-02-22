const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');
const UnauthorizedErr = require('../errors/unauth-err');
const {JWT_SECRET} = process.env;

function getUserData(id, res, next) {
  if (!id) {
    return next(new NotFoundError('Пользователь не найден'));
  }
  return res.send(id);
}

const getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => getUserData(user, res))
    .catch(next);
};

const updateUserData = (req, res, next) => {
  const {body} = req;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: body.name,
      email: body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError('Ничего не найдено'))
    .then((user) => getUserData(user, res, next))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw next(new BadRequestErr('Передан невалидный id пользователя'));
      }
      throw next(err);
    });
};

module.exports={
  getUserProfile,
  updateUserData
}