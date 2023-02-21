const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const  validator  = require('validator');

const movieSchema = new Schema({
  country:{
    type: String,
    required: true,
  },
  director:{
    type: String,
    required: true,
  },
  duration:{
    type: Number,
    required: true,
  },
  year:{
    type: Number,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'ссылка не валидна',
    },
  },
  trailerLink:{
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'ссылка не валидна',
    },
  },
  thumbnail:{
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'ссылка не валидна',
    },
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId:{
    type: String,
    required: true,
  },
  nameRU:{
    type: String,
    required: true,
  },
  nameEN:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('movie', movieSchema);