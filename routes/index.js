const { celebrate } = require('celebrate');
const router = require('express').Router();

// подключение роутов
const users = require('./users');
const movies = require('./movies');
const { auth } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { signupValidation, signinValidation } = require('../validation/validation');
const NotFoundError = require('../errors/not-found');

// роут логина
router.post('/signin', celebrate(signinValidation), login);

// роут регистрации
router.post('/signup', celebrate(signupValidation), createUser);

// мидлвер автоматической аутентификации
router.use(auth);

router.use('/movies', movies);
router.use('/users', users);

// роут несуществующей страницы
router.use(() => { throw new NotFoundError('Извините, такой страницы не существует!'); });

module.exports = router;
