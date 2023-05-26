const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const ShortUrl = require('./models/shortUrl')
const User = require('./models/users')
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



app.get('/', async (req, res) => {
  console.log(req.session.user)
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  const shortUrls = await ShortUrl.find({"user": req.session.user._id});
 
  

  
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;
  
  res.render('index', { shortUrls: shortUrls, successMessage:successMessage, req: req });
});

app.post('/shortUrls', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  console.log(req.body)
  await ShortUrl.create({ full: req.body.fullUrl, user: req.session.user._id})
  res.redirect('/');
});

app.get('/signup', (req, res) => {
  res.render('signup', { errorMessage: '' });
});

app.post('/signup',async (req, res) => {
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


app.get('/login', (req, res) => {
  res.render('login', { errorMessage: '' });
});

app.post('/login', async (req, res) => {
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



app.get('/:shortUrl', async(req, res) => {
  const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);