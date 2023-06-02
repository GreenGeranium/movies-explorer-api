// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

// логирование
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found');
const router = require('./routes');
const { centralisedErrorHandler } = require('./errors/centralised-handler');
const { limiter } = require('./middlewares/ratelimiter');

// запуск сервера с дефолтным портом 3000
const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(limiter);

// подключение к базе данных mestodb
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(err);
});

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

// роут несуществующей страницы
app.use(() => { throw new NotFoundError('Извините, такой страницы не существует!'); });

// глобальный обработчик ошибок
app.use(errors());

app.use(centralisedErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
