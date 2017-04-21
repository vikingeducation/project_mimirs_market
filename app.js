const express = require("express");
const app = express();

// ----------------------------------------
// Dotenv
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['aSg89Tc6lMpn8xwW1']
}));
app.use(cookieParser());

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  //  helpers: helpers.registered,
  partialsDir: "views/",
  defaultLayout: "main",
  helpers: helpers.registered
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Mongoose
// ----------------------------------------
var mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")(req).then(() => next());
  }
});
// ----------------------------------------
// Method Override
// ----------------------------------------
app.use((req, res, next) => {
  let method;
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
  } else if (typeof req.body === "object" && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }
  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }
  next();
});

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
app.use(morgan("tiny"));
app.use((req, res, next) => {
  console.log();
  ["query", "params", "body"].forEach(key => {
    if (req[key]) {
      const capKey = key[0].toUpperCase() + key.substr(1);
      const value = JSON.stringify(req[key], null, 2);
      console.log(`${capKey}: ${value}`);
    }
  });
  next();
});

// ----------------------------------------
// Shopping Cart
// ----------------------------------------
app.use((req, res, next) => {
  let cart;
  let quantity = 0;
  if (req.cookies.cart) {
    cart = req.cookies.cart;
    for (let id in req.cookies.cart) {
      quantity += req.cookies.cart[id];
    }
  }
  app.locals.cartQuantity = quantity;
  req.cart = cart || {};
  next();
});

// ----------------------------------------
// Routes
// ----------------------------------------
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);

const cartRouter = require("./routes/cart");
app.use("/cart", cartRouter);

const checkoutsRouter = require("./routes/checkouts");
app.use("/checkouts", checkoutsRouter);

const ordersRouter = require("./routes/orders");
app.use("/orders", ordersRouter);

const analyticsRouter = require("./routes/analytics");
app.use("/analytics", analyticsRouter);
// ----------------------------------------
// Error Handler
// ----------------------------------------
app.use((err, req, res, next) => {
  res.status(500).send(err.stack);
});

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);
