const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use();

app.use(requestLogger); // подключаем логгер запросов

app.use(errorLogger); // подключаем логгер ошибок - после роутов и до обработчиков ошибок

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
