// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

// логирование
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const { centralisedErrorHandler } = require('./errors/centralised-handler');
const { limiter } = require('./middlewares/ratelimiter');

const allowedCors = [
  'http://localhost:4000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://api.geranius.nomoredomains.rocks',
  'https://api.geranius.nomoredomains.rocks',
  'http://geranius.nomoredomains.rocks',
  'https://geranius.nomoredomains.rocks',
];

// запуск сервера с дефолтным портом 3000
const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());

// подключение к базе данных mestodb
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(err);
});

app.use(express.json());

// CORS
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
});

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

// глобальный обработчик ошибок
app.use(errors());

app.use(centralisedErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
