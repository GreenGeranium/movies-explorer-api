const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedErr = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Поле "email" не является валидным',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new UnauthorizedErr('Неправильные почта или пароль');
    } return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedErr('Неправильные почта или пароль');
      }
      return user;
    });
  });
};

module.exports = mongoose.model('User', userSchema);
