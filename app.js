require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();

const { PORT = 3000, JWT_SECRET } = process.env;
const { login, createUser} = require('./controllers/users')
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

mongoose.set('strictQuery', true);
mongoose.set('strict', true);
//mongoose.connect('mongodb://localhost:27017/filmsdb');
mongoose.connect('mongodb://127.0.0.1:27017/filmsdb');

app.use(cookieParser)

app.use(requestLogger);

app.use('/signup', createUser)
app.use('/signin', login)

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);

app.use('*', (req, res, next) => next(new NotFoundError('404 Старница не найдена')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`секретный jwt ${JWT_SECRET}`);
});

app.use(require('./middlewares/errors'));