const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const session = require("express-session");
const mongooseModels = require("./models/mongoose");
const sqlModels = require("./models/sequelize");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const products = require("./routes/products");
const buildQuery = require("./lib/buildQuery");
const cart = require("./routes/cart");

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

app.use("/products", products);
app.use("/cart", cart);

app.get("/", (req, res) => {
  req.session.cart = req.session.cart || {};
  let length = Object.keys(req.session.cart).length;
  sqlModels.Product.findAll(buildQuery(req.query)).then(products => {
    sqlModels.Category.findAll({ order: ["id"] }).then(categories => {
      res.render("index", { products, categories, length });
    });
  });
});

app.post("/addCart", (req, res) => {
  let id = req.body.productId;
  req.session.cart[id] = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    productId: id,
    quantity: 1
  };
  console.log(req.session.cart);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Now listening...");
});
