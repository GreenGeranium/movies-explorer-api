// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

// логирование
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found');
const router = require('./routes');
const { centralisedError } = require('./errors/centralised-handler');

// запуск сервера с дефолтным портом 3000
const app = express();
const { PORT = 3000 } = process.env;

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
app.use(centralisedError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
