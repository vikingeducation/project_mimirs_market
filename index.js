const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const session = require("express-session");

const sqlModels = require("./models/sequelize");
const mongooseModels = require("./models/mongoose");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const productsRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const checkoutRoute = require("./routes/checkout");
const chargesRoute = require("./routes/charges");

const buildQuery = require("./lib/buildQuery");
const sessionBuilder = require("./lib/sessionBuilder");
const getCartInfo = require("./lib/getCartInfo");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

const hbs = exphbs.create({
  partialsDir: "views/partials",
  defaultLayout: "main"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: "123456",
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/checkout", checkoutRoute);
app.use("/charges", chargesRoute);

app.get("/", (req, res) => {
  req.session.cart = req.session.cart || {};
  let keys = Object.keys(req.session.cart);
  const cartItems = getCartInfo(req.session.cart);
  let products;
  let categories;
  sqlModels.Product
    .findAll(buildQuery(req.query))
    .then(results => {
      products = results;
      return sqlModels.Category.findAll({ order: ["id"] });
    })
    .then(results => {
      categories = results;
      products = products.map(product => {
        if (keys.includes(product.id.toString())) {
          product.selected = true;
        }
        return product;
      });
      res.render("index", { products, categories, cartItems });
    })
    .catch(e => {
      res.status(500).send(e.stack);
    });
});

app.post("/addCart", (req, res) => {
  let id = req.body.productId;
  req.session.cart[id] = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    productId: id,
    quantity: 1,
    selected: true
  };
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Now listening...");
});
