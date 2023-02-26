require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const { PORT = 3000, JWT_SECRET } = process.env;
//const { login, createUser} = require('./controllers/users')
//const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
//const NotFoundError = require('./errors/not-found-err');
const router = require('./routes/index');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/filmsdb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`секретный jwt ${JWT_SECRET}`);
});

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(router)

const allowedCors = [
  'http://localhost:3000/',
];

const corsOptions = {
  origin: allowedCors,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

//краш-тест
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.use('/signup', createUser)
// app.use('/signin', login)
//
// app.use(auth);
//
// app.use('/users', require('./routes/users'));
// app.use('/movies', require('./routes/movies'));

app.use(errorLogger);

//app.use('*', (req, res, next) => next(new NotFoundError('404 Старница не найдена')));

app.use(require('./middlewares/errors'));
