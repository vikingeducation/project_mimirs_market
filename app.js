const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Session/cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(
  cookieSession({
    name: 'session',
    keys: ['asdf1234']
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  req.session.cart = req.session.cart || { items: {}, size: 'empty' };
  next();
});

// Flash messages
const flash = require('express-flash-messages');
app.use(flash());

// Method override
app.use((req, res, next) => {
  let method;

  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
  } else if (typeof req.body === 'object' && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }

  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }

  next();
});

// Public
app.use(express.static(`${__dirname}/public`));

// Logging
const morgan = require('morgan');
app.use(morgan('tiny'));

// Mongoose
const mongoose = require('mongoose');
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

// Template engine
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  defaultLayout: 'application',
  helpers: helpers.registered
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Routes
const productsRoutes = require('./controllers/products');
const cartRoutes = require('./controllers/cart');
const checkoutRoutes = require('./controllers/checkout');
const chargesRoutes = require('./controllers/charges');
const adminRoutes = require('./controllers/admin');

app.use('/products', productsRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/charges', chargesRoutes);
app.use('/admin', adminRoutes);
app.use('/', (req, res) => {
  res.redirect('/products');
});

// Server
const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
