require('dotenv').config();

const express = require('express');
const auth = require('./middlewares/auth');

const app = express();

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));