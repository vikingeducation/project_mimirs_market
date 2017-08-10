const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const session = require("express-session");
const mongooseModels = require("./models/mongoose");
const sqlModels = require("./models/sequelize");
const ProductsController = require("./controllers/products");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const products = require("./routes/products");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

app.use(express.static(__dirname + "/public"));

const hbs = exphbs.create({
  partialsDir: "views/partials",
  defaultLayout: "main"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

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

app.get("/", ProductsController.listProducts);

app.get("/cart", (req, res) => {
  const quantities = {};
  const productIds = req.sessions.cart.map(item => {
    quantities[item.id] = item.quantity;
    return item.id;
  });

  sqlModels.Product
    .findAll({ where: { id: { in: productIds } } })
    .then(products => {
      products = products.forEach(product => {
        product.quantity = quantities[product.id];
      });

      res.render("cart", { products });
    });
});

app.listen(3000, () => {
  console.log("Now listening...");
});
