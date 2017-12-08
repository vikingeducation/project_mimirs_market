var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let session = require('express-session');
let mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
let products = require('./routes/products');
let cart = require('./routes/cart');
let checkout = require('./routes/checkout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'alphamodular'}));
app.use((req, res, next) => {
  if (!req.session.userId) {
    let userId = Math.floor(Math.random() * 100000);
    req.session.userId = userId;
  }
  next();
});
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

app.use('/', index);
app.use('/products', products);
app.use('/users', users);
app.use('/cart', cart);
app.use('/checkout', checkout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

// app.listen(3000, ()=>{
//   console.log("Server listening at port 3000: ");
// }
// );

module.exports = app;
