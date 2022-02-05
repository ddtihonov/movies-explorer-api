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
const errorHandler = require('./middlewares/errorHandler');

const {
  PORT = 3000,
  LOCAL_DB = 'mongodb://localhost:27017/moviesdb',
} = process.env;
const app = express();

mongoose.connect(LOCAL_DB);

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());// => токен в req.cookies.token
app.use(helmet());

app.use(cors);
app.use(router);

app.use(errorLogger); // подключаем логгер ошибок - после роутов и до обработчиков ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
