const express = require("express");
const app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieParser = require("cookie-parser");
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
//const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  //  helpers: helpers.registered,
  partialsDir: "views/",
  defaultLayout: "main",
  helpers: {
    alreadyInCart: (cartIds, productId) => {
      if (cartIds) return cartIds.includes(productId);
    },
    currency: (number) => {
      return '$' + number.toFixed(2);
    }
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

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
// Cart Counter
// ----------------------------------------
app.use((req, res, next) => {
  let quantity = 0;
  if (req.cookies.cart) {
    for (let id in req.cookies.cart) {
      quantity += req.cookies.cart[id];
    }
  }
  app.locals.cartQuantity = quantity;
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
