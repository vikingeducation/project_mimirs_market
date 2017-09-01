var express = require("express");
var app = express();

/*change this later for production*/
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var { STRIPE_SK, STRIPE_PK } = process.env;
let stripe = require("stripe")(STRIPE_SK);

//MIDDLEWARE
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const session = require("express-session");
app.use(
  session({
    secret: "chamberofsecretsOHHHSNAKES",
    resave: false,
    saveUninitialized: true
  })
);

const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);
app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});
app.use(express.static(`${__dirname}/public`));
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);
app.use(morgan("tiny"));
app.use(morganToolkit());

const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

var expressHandlebars = require("express-handlebars");
var hbs = expressHandlebars.create({
  partialsDir: "views/partials",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

////Routes
const checkoutRouter = require("./routers/checkout");
var productsRouter = require("./routers/products");
const cartRouter = require("./routers/cart");
const orderRouter = require("./routers/order");
app.get("/", (req, res) => {
  res.redirect("/products");
});
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/orders", orderRouter);
var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

//SERVER
var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
