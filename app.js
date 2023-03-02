require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3001, JWT_SECRET } = process.env;
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/moviedb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`секретный jwt ${JWT_SECRET}`);
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(router);

app.use(requestLogger);

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

// краш-тест
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errorLogger);

app.use(errors());
app.use(require('./middlewares/errors'));
