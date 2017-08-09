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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

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

app.get("/", (req, res) => {
  const params = parseParams(req.query);

  sqlModels.Product
    .findAll({
      include: [
        {
          model: sqlModels.Category
        }
      ],
      where: params,
      limit: 18
    })
    .then(products => {
      sqlModels.Category.findAll({ order: ["id"] }).then(categories => {
        res.render("index", { products, categories });
      });
    });
});

// app.get("/test", (req, res) => {
//   User.find().then(users => {
//     console.log(users);
//     res.render("testing", { users });
//   });
// });

// app.post("/filter", (req, res) => {
//   let params = {
//     categoryId: req.body.category
//   };
//   sqlModels.Product
//     .findAll({
//       include: [
//         {
//           model: sqlModels.Category
//         }
//       ],
//       where: params,
//       limit: 18
//     })
//     .then(products => {
//       sqlModels.Category.findAll({ order: ["id"] }).then(categories => {
//         res.render("index", { products, categories });
//       });
//     });
// });

function parseParams(params) {
  parsedParams = {};

  if (params) {
    parsedParams["categoryId"] = params.category;
  }

  return parsedParams;
}

// {
//   categoryId: 9,
//   price: {$and: [{$gte: 100}, {lte: 1000}]}
// }

app.listen(3000, () => {
  console.log("Now listening...");
});
