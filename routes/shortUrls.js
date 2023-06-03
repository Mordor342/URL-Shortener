const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/shortUrl');

router.post('/', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  console.log(req.body);
  await ShortUrl.create({ full: req.body.fullUrl, user: req.session.user._id });
  res.redirect('/');
});

module.exports = router;

