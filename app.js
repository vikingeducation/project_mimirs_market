const express = require("express");
const app = express();

// .env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Templates
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application",
  helpers: require("./helpers")
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Static Files
app.use(express.static(`${__dirname}/public`));

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Session
const session = require("express-session");
app.use(
  session({
    secret: "adfs89adfs890qrkjlrqjkl;9xzcv88-v",
    resave: false,
    saveUninitialized: true
  })
);

// Flash
const flash = require("express-flash-messages");
app.use(flash());

// Log Request Info
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Method Overriding
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

// Connect to Mongoose
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) next();
  else require("./mongo")().then(() => next());
});

// Routes
const cart = require("./routers/cart");
app.use(cart.cart);
app.use("/cart", cart.router);
app.all("/", (req, res) => res.redirect("/products"));
app.use("/products", require("./routers/products"));
app.use("/admin", require("./routers/admin"));

// Set up port/host
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
let args = process.env.NODE_ENV === "production" ? [port] : [port, host];

// helpful log when the server starts
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

// Use apply to pass the args to listen
app.listen.apply(app, args);
