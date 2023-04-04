const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const ConflictErr = require('../errors/conflict-err');
const UnauthorizedErr = require('../errors/unauth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');

const {JWT_SECRET, NODE_ENV} = process.env;

const {
  VALIDATION_ERR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
  USER_NOT_FOUND_ERR_MESSAGE,
  CONFLICT_ERR_MESSAGE,
  UNAUTHORIZED_ERR_MESSAGE,
} = require('../utils/err-messages');

const {
  TOKEN_HANDLE_SUCCESS_MESSAGE,
  LOGOUT_SUCCESS_MESSAGE,
} = require('../utils/success-messages');

const createUser = async (req, res, next) => {
  try{
    const {
      email,
      password,
      name,
    } = req.body;

    const hash = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      email,
      password: hash,
      name,
    })
  const token = jwt.sign({_id: newUser._id}, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'},);

    return res
      .cookie('jwt', token,
        {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'Strict',
          secure: true,
        })
      .send({
        name: newUser.name,
        email: newUser.email,
        id: newUser._id,
      })
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestErr(VALIDATION_ERR_MESSAGE));
    }
    if (err.code === 11000) {
      return next(new ConflictErr(CONFLICT_ERR_MESSAGE));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  try {
    const user = await User.findOne({email}).select('+password');
    if (!user) {
      return next(new UnauthorizedErr(UNAUTHORIZED_ERR_MESSAGE));
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return next(new UnauthorizedErr(UNAUTHORIZED_ERR_MESSAGE));
    }
    const token = jwt.sign({_id: user._id}, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'},);
    return res.cookie('jwt', token,
      {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }
    ).send({_id: user._id, email: user.email, name: user.name, message: TOKEN_HANDLE_SUCCESS_MESSAGE});
  } catch (err) {
    return next(err);
  }
};

const logOut = (req, res, next) => {
  res.clearCookie('jwt',
    {sameSite: 'None', secure: true}
  ).send({message: LOGOUT_SUCCESS_MESSAGE})
    .catch(next);
};

function getUserData(id, res, next) {
  if (!id) {
    return next(new NotFoundError(USER_NOT_FOUND_ERR_MESSAGE));
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
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError(NOT_FOUND_ERR_MESSAGE))
    .then((user) => getUserData(user, res, next))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr(CONFLICT_ERR_MESSAGE));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestErr(VALIDATION_ERR_MESSAGE));
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
