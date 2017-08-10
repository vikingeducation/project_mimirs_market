var express = require("express");
var router = express.Router();
const { Product, Category } = require("../models/sequelize");

//make a getCategories Names function`
//TODO: refactor some of the model handling code
//TODO: change the routing / front end so that it uses params instead of different routes

//return a new array of products{} with isInCart set correctly
let isInCart = function(cart, products) {
  console.log(`cart = ${cart}`);
  console.log(`products = ${products}`);
  debugger;
  let p = products.map(product => {
    let productFake = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      img: product.img
    };
    productFake["isInCart"] = cart.some(item => {
      return Number(item.id) === product.id;
    });
    return productFake;
  });
  console.log(`new products = ${p[isInCart]}`);
  return p;
};

//index Route
router.get("/", (req, res) => {
  req.session.cart = req.session.cart || [];
  let cats = Category.findAll({ attributes: ["name"] });
  let products = Product.findAll({});
  Promise.all([cats, products])
    .then(results => {
      let categories = results[0].map(el => {
        return el.name.trim();
      });
      let productsObj = isInCart(req.session.cart, results[1]);
      res.render("products/index", {
        products: productsObj,
        categories: categories,
        cart: req.session.cart
      });
    })
    .catch(error => {
      res.status(500).send(`error ${error}`);
    });
});

//show Route
router.get("/show/:productId", (req, res) => {
  Product.findById(req.params.productId).then(product => {
    Product.findAll({
      where: { categoryId: product.categoryId, id: { $ne: product.id } },
      limit: 6
    }).then(relatedProducts => {
      res.render("products/show", {
        product: product,
        products: relatedProducts
      });
    });
  });
});

///search
//Enable text search that searches the name, category and description of a product
//TODO: enable search by category
router.post("/search", (req, res) => {
  //category: { $regexp: r }
  let r = `${req.body.search}`;
  debugger;
  Product.findAll({
    where: {
      $or: [{ name: { $regexp: r } }, { description: { $regexp: r } }]
    }
  }).then(products => {
    res.render("products/index", { products });
  });
});

//grab all categories, grab category then the products in that category, last render
router.post("/filter", (req, res) => {
  //TODO: make the images work by changing the path here?
  let categories = Category.findAll({ attributes: ["name"] });
  Category.find({
    where: { name: req.body.filterByCategory }
  }).then(category => {
    let products = Product.findAll({
      where: { categoryId: category.id }
    });
    Promise.all([categories, products]).then(results => {
      let categoriesStrings = results[0].map(el => {
        return el.name.trim();
      });
      res.render("products/index", {
        products: results[1],
        categoryName: category.name,
        categories: categoriesStrings
      });
    });
  });
});

//TODO: add max price,
//add min price

router.post("/sort", (req, res) => {
  //TODO: MAKE AN OPTIONS HASH
  //TODO: make the images work by changing the path here?
  let cascade;
  let param = req.body.sortOption.slice(0, -1);
  param === "date" ? (param = "createdAt") : (param = param);
  /[name|price|date]A$/.test(req.body.sortOption)
    ? (cascade = "ASC")
    : (cascade = "DESC");
  Product.findAll({ order: [[param, cascade]] }).then(products => {
    res.render("products/index", { products });
  });
});

module.exports = router;
