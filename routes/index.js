const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/shortUrl');

router.get('/', async (req, res) => {
    console.log(req.session.user);
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }


  const shortUrls = await ShortUrl.find({ user: req.session.user._id });

  const successMessage = req.session.successMessage;
  delete req.session.successMessage;

  res.render('index', { shortUrls: shortUrls, successMessage: successMessage, req: req });
});

module.exports = router;