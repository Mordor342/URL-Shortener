const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const ShortUrl = require('./models/shortUrl')
const User = require('./models/users')
const indexRouter = require('./routes/index');
const shortUrlsRouter = require('./routes/shortUrls');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

const app = express()


app.use(express.json())

mongoose.connect('mongodb+srv://admin:admin123@cluster0.lab5bvb.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
});

const secretKey = 'mySecretKey123';

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
  })
);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/shortUrls', shortUrlsRouter);




app.get('/:shortUrl', async(req, res) => {
  const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);