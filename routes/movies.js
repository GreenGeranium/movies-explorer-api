const { getMovies, createMovie, deleteMovie} = require('../controllers/movies');
const movies = require('express').Router();

// возвращает все сохранённые текущим пользователем фильмы
movies.get('/', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
movies.post('/', createMovie);

// удаляет сохранённый фильм по id
movies.delete('/:movieid', deleteMovie);

module.exports = movies;
