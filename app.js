require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000, JWT_SECRET, NODE_ENV } = process.env;
const { errors } = require('celebrate');
const { DATA_BASE } = require('./utils/mongo-config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { limiter } = require('./utils/rate-limiter');
const { corsOptions } = require('./utils/cors-config');

mongoose.set('strictQuery', false);
mongoose.connect(DATA_BASE);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
  console.log(`секретный jwt: ${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  console.log(`база данных: ${DATA_BASE}`);
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(router);
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
