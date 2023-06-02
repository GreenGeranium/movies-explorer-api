const { Joi } = require('celebrate');
const { urlRegex } = require('../utils/const');

const signupValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
};

const signinValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const updateUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
};

const createMovieValidation = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(urlRegex).required(),
    trailerLink: Joi.string().regex(urlRegex).required(),
    thumbnail: Joi.string().regex(urlRegex).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const deleteMovieValidation = {
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
};

module.exports = {
  signupValidation,
  signinValidation,
  updateUserValidation,
  createMovieValidation,
  deleteMovieValidation,
};
