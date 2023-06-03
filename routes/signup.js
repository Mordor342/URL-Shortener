const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', (req, res) => {
  res.render('signup', { errorMessage: '' });
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    console.log('User created:', user);
    req.session.successMessage = 'Registration successful.';
    res.redirect('/login');
  } catch (err) {
    console.error('Error creating user:', err);
    res.render('signup', { errorMessage: err.message });
  }
});

module.exports = router;
