const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();
const { errors } = require('celebrate');

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { cors } = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());// => токен в req.cookies.token
app.use(helmet());

app.use(cors);
app.use('/', router);

app.use(errorLogger); // подключаем логгер ошибок - после роутов и до обработчиков ошибок
app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({
    message: err.statusCode === 500
      ? 'На сервере произошла ошибка'
      : err.message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
