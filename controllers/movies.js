const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({}).then((data) => res.send(data))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieid).then((data) => {
    if (!data) {
      throw new NotFoundError('Нет карточки с таким id');
    } else if (!(req.user._id === data.owner.toString())) {
      throw new ForbiddenErr('Вы не можете удалить чужую карточку');
    }
    return Movie.deleteOne({ _id: data._id }).then(() => {
      res.send(data);
    });
  }).catch((err) => {
    next(err);
  });
};
