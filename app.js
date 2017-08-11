const express = require("express");
const app = express();
const mongoose = require("mongoose");
var models = require("./models/mongoose");

var Order = mongoose.model("Order");

//k1004547@mvrht.net
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var { STRIPE_SK, STRIPE_PK } = process.env;
var stripe = require("stripe")("sk_test_S98pl0PQa8NtUemUE2KtQLDU");
// Templates
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application",
  helpers: require("./helpers")
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Session
app.use(
  require("cookie-session")({
    name: "session",
    keys: ["xBR44RmMaZvYRwOkE26T"]
  })
);

// Flash
app.use(require("express-flash-messages")());

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Log Request Info
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Method Overriding
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

// Routes
//app.use("/", require("./routers/account"));
app.use("/products", require("./routers/products"));
app.use("/checkout", require("./routers/checkout"));
app.use("/register", require("./routers/register"));
// Set up port/host
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
let args = process.env.NODE_ENV === "production" ? [port] : [port, host];

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});
app.post("/charges", (req, res) => {
  var charge = req.body;
  var purchasedProducts = {};
  let productIds = [];
  let productQuantity = [];
  let productPrice = [];
  //TODO: confirm cost matches purchase
  stripe.charges
    .create({
      amount: req.session.totalCost,
      currency: "usd",
      description: "You paid money",
      source: charge.stripeToken
    })
    .then(charged => {
      Object.keys(req.session.cart).forEach(function(key) {
        if (key !== "totalCost") {
          console.log(key);
          purchasedProducts[key] = {};
          purchasedProducts[key].quantity = req.session.cart[key].quantity;
          purchasedProducts[key].price = req.session.cart[key].price;
          purchasedProducts[key].id = req.session.cart[key].id;
          purchasedProducts[key].total =
            req.session.cart[key].price * req.session.cart[key].quantity;
          productIds.push(req.session.cart[key].id);
          productQuantity.push(req.session.cart[key].quantity);
          productPrice.push(req.session.cart[key].price);
        }
      });

      console.log(charged);
      console.log("charged");
      var order = new Order({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        streetaddress: req.body.streetaddress,
        state: req.body.myState,
        products: purchasedProducts,
        totalcost: req.session.totalCost,
        date: Date.now(),
        productIdArray: productIds,
        productQuantityArray: productQuantity,
        productPriceArray: productPrice
      });
      order.save();
    })
    .then(() => {
      res.redirect("/products");
    })
    .catch(e => res.status(500).send(e.stack));
});
app.get("/", (req, res) => {
  Order.find({})
    .then(results => {
      console.log("results");
      console.log(results);
      return results;
    })
    .then(orderResult => {
      return res.render("analytics/orders", { orders: orderResult });
    });
});

//k1004547@mvrht.net
// helpful log when the server starts
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

// Use apply to pass the args to listen
app.listen.apply(app, args);
