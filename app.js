const express = require('express');
const app = express();

const router = require('./routers')
const index = require('./routers/index.js');
const shoppingCartRouter = require('./routers/shoppingCart');
const productShowcaseRouter = require('./routers/productShowcase');

let cart;
// const product = require('./routers/posts.js');

// ----------------------------------------
// App Variables
// ----------------------------------------
app.locals.appName = 'Mimirs Market';

// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use((req, res, next) => {
  console.log("TOP OF MIDDLEWARE STACK");
  next();
});
// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// attaches .body to req object

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require('cookie-session');

const sessionTracker = (tracker) => {
  app.use((req,res,next) => {
    console.log("------------------- START req.session -------------------");
    console.log(tracker);
    console.log(req.session);
    console.log("process.env.SESSION_SECRET: ", process.env.SESSION_SECRET);
    console.log("-------------------- END req.session --------------------");
    console.log(" ");
    console.log(" ");
    next();
  });
};

sessionTracker("pre-session middleware");

app.use(cookieSession({
  name: 'session',
  keys: [
    process.env.SESSION_SECRET || 'secret'
  ]
}));


sessionTracker("post-session middleware");

// Makes 'session' object available to handlebars.
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ---------------------------------------------------------
// Shopping cart 
// 2017-12-30 12:02
// ---------------------------------------------------------
// Set up session-based shopping cart if none-exists

app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require('express-flash-messages');
app.use(flash());


// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(methodOverride(
  getPostSupport.callback,
  getPostSupport.options // { methods: ['POST', 'GET'] }
));


// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});


// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));


// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require('morgan');
const morganToolkit = require('morgan-toolkit')(morgan);

app.use(morganToolkit());


// ----------------------------------------
// Routes
// ----------------------------------------
app.use('/', index);

app.use('/productShowcase', productShowcaseRouter);

app.use('/shoppingCart', (req, res, next) => {
  if (typeof cart !== "undefined") {
    next();
  }
  const ShoppingCart = require('./shoppingCart.js');
  cart = new ShoppingCart();
  next();
});

app.use('/shoppingCart', shoppingCartRouter);

// app.use('products/', product);

// ----------------------------------------
// Handlebars
// ----------------------------------------

const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT ||
  process.argv[2] ||
  3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ?
  args = [port] :
  args = [port, host];

args.push(() => {
  console.log(`Listening: http://${ host }:${ port }\n`);
});

if (require.main === module) {
  app.listen.apply(app, args);
}


// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});


module.exports = app;

