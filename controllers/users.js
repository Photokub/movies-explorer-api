const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const ConflictErr = require('../errors/conflict-err');
const UnauthorizedErr = require('../errors/unauth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');

const {JWT_SECRET} = process.env;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      id: user._id
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestErr('Переданы некорректные данные пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictErr(`Пользователь с ${email} уже существует`));
      }
      return next(err);
    });
};

const login = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  try {
    const user = await User.findOne({email}).select('+password');
    if (!user) {
      return next(new UnauthorizedErr('Ошибка авторизации 401'));
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return next(new UnauthorizedErr('Ошибка авторизации 401'));
    }
    const token = jwt.sign({_id: user._id}, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'});
    return res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    }).send({_id: user._id, user: user.email, message: 'Токен jwt передан в cookie'});
  } catch (err) {
    return next(err);
  }
};

const logOut = (req, res, next) => {
  res.clearCookie('jwt').send({message: 'Успешный выход из аккаунта'})
    .catch(next);
};

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
  const {
    email,
    name,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: name,
      email: email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError('Ничего не найдено'))
    .then((user) => getUserData(user, res, next))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr(`Пользователь с ${email} уже существует`));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestErr('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getUserProfile,
  updateUserData,
  login,
  logOut,
  createUser,
};
