const mongoose = require('mongoose');
const { Schema } = require('mongoose');
import { isEmail } from 'validator';


const userSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true,
    validate: [ isEmail, 'невалидный email' ]
  },
  password:{
    type: String,
    required: true,
    select: false,
  },
  name:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);