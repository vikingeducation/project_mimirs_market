// Initialize process variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Setting up Express
const express = require("express");
const app = express();

// Setting up body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up express-handlebars
const exphbs = require("express-handlebars");
app.set("view engine", "handlebars");
const hbs = exphbs.create({ defaultLayout: "application" });
app.engine("handlebars", hbs.engine);
app.use(express.static(`${__dirname}/public`));

// Setting up Cookie session
var cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentUser = req.session.currentUser;
  next();
})

// Method Override
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');


app.use(methodOverride(
  getPostSupport.callback,
  getPostSupport.options // { methods: ['POST', 'GET'] }
));

// Passing our routes
const productsRoutes = require("./routers/products");
app.use("/products", productsRoutes);

const cartRoutes = require("./routers/cart");
app.use("/cart", cartRoutes)

const chargeRoutes = require("./routers/charges");
app.use('/charges', chargeRoutes);

const mongoose = require("mongoose");
app.use((req, res, next) => {
  if(mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
})


// Direct to products page
app.get('/', (req, res) => {
  return res.redirect("/products");
})

// Setting up port
var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";
app.listen(port, () => {
  console.log("listening at " + port);
});
