var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/mongo')[env];
var expressHandlebars = require('express-handlebars');
var flash = require('express-flash-messages');
var helpers = require('./helpers');


// load routes
var index = require('./routes/index');
var prodRoute = require('./routes/products');
var cartRoute = require('./routes/cart');
var adminRoute = require('./routes/admin');

var app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv')
    .config();
}

// view engine setup
var hbs = expressHandlebars.create({
  helpers: helpers.registered,
  partialsDir: path.join(__dirname, '/views/shared'),
  defaultLayout: path.join(__dirname, '/views/layout'),
  extname: ".hbs"
});

app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')(req)
      .then(() => next());
  }
});
//method overriding
app.use((req, res, next) => {
  var method;
  // Allow method overriding in
  // the query string and POST data
  // and remove the key after found
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
  } else if (typeof req.body === 'object' && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }
  // Upcase the method name
  // and set the request method
  // to override it from GET to
  // the desired method
  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }
  next();
});
// session setup to use mongo as backing store
app.use(session({
  secret: 'ajfbsd-fdsaf-44asd47-fdadfs',
  cookie: {
    maxAge: 2628000000
  },
  resave: false,
  saveUninitialized: true,
  store: new(require('express-sessions'))({
    storage: 'mongodb',
    db: config.database,
    collection: 'sessions', // optional
    expire: 86400 // optional
  })
}));
// flash messages
app.use(flash());

app.use('/', index);
app.use('/products', prodRoute);
app.use('/cart', cartRoute);
app.use('/admin', adminRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  console.log(req);
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
