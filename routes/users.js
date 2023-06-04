const users = require('express').Router();
const { celebrate } = require('celebrate');
const {
  updateProfile, getMyUser,
} = require('../controllers/users');
const { updateUserValidation } = require('../validation/validation');

// возвращение пользовательских данных
users.get('/me', (req, res, next) => {
  getMyUser(req, res, next);
});

// обновляет профиль
users.patch('/me', celebrate(updateUserValidation), updateProfile);

module.exports = users;
