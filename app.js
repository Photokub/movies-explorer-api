require('dotenv').config();

const express = require('express');
const auth = require('./middlewares/auth');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();

const { login, createUser} = require('./controllers/users')
const { PORT = 3000, JWT_SECRET } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/filmsdb');

app.use(cookieParser)

app.use('/signup', createUser)
app.use('/signin', login)

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`секретный jwt ${JWT_SECRET}`);
});