const movies = require('express').Router();
const { celebrate } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../validation/validation');

// возвращает все сохранённые текущим пользователем фильмы
movies.get('/', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
movies.post('/', celebrate(createMovieValidation), createMovie);

// удаляет сохранённый фильм по id
movies.delete('/:movieId', celebrate(deleteMovieValidation), deleteMovie);

module.exports = movies;
