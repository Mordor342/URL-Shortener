const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', (req, res) => {
  res.render('login', { errorMessage: '' });
});

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      res.render('login', { errorMessage: 'Invalid email or password' });
      return;
    }

    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    console.error('Error during login:', err);
    res.redirect('login', { errorMessage: 'Error during login' });
  }
});

module.exports = router;
