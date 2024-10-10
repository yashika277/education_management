const express = require('express');
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').notEmpty()],
  register
);
router.post('/login', login);

module.exports = router;
