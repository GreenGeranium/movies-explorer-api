const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile, getMyUser,
} = require('../controllers/users');

// возвращение пользовательских данных
users.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.alternatives().try(Joi.string().hex().length(24), Joi.string().valid('me')),
  }),
}), (req, res, next) => {
  const { userId } = req.params;
  getMyUser(req, res, next);
});

// обновляет профиль
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = users;