const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const AlreadyExistsErr = require('../errors/already-exists');
const NotFoundError = require('../errors/not-found');

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, email, password: hash,
    })
      .then((data) => {
        const user = {
          name: data.name,
          email: data.email,
        };
        res.status(201).send(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new AlreadyExistsErr('Данный профиль уже существует'));
          return;
        }
        next(err);
      });
  });
};

// авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.send({ token });
  }).catch((err) => {
    next(err);
  });
};

// возвращает информацию о текущем пользователе
module.exports.getMyUser = (req, res, next) => {
  const { _id } = req.user;
  User.findOne({ _id }).then((user) => res.send(user))
    .catch(next);
};

// обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Данного профиля нет');
      }
      res.send(data);
    })
    .catch(next);
};
