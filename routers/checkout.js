const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const sequelize = models.sequelize;
const helpers = require("../helpers");

router.get("/", (req, res) => {
  let newCart = [];
  if (req.session.cart !== undefined) {
    Object.keys(req.session.cart).forEach(function(key) {
      console.log(key, req.session.cart[key]);
      newCart.push(key);
    });
    // for (let k in req.session.cart) {
    //   newCart.push(k);
    // }
    console.log("had a cart");

    return res.render(`checkout/index`, { cart: req.session.cart });
  } else {
    console.log("not a  a cart");
    return res.redirect("/products");
  }
});
//append discounts to the url
router.post("/:id", (req, res) => {
  let productId = req.params.id;
  if (req.session.cart === undefined) {
    req.session.cart = {};
  }
  //req.session.cart = {};
  Product.find({ where: { id: productId } })
    .then(result => {
      let newPurchase = {
        name: result.name,
        quantity: 1,
        price: result.price,
        sku: result.sku.toString(),
        id: result.id
      };
      req.session.cart[productId] = newPurchase;
      console.log("cart");
      console.log(req.session.cart);
      res.redirect("/checkout");
    })
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e.stack);
    });
});
router.post("/deleteItem/:id", (req, res) => {
  // if (req.session.cart === undefined) {
  // }
  let deleteThis = req.params.id;
  delete req.session.cart[deleteThis];
  //delete req.session.cart.deleteThis;
  res.redirect("/checkout");
});
router.post("/subtract/:id", (req, res) => {
  req.session.cart[req.params.id].quantity--;

  //delete req.session.cart.deleteThis;
  res.redirect("/checkout");
});
router.post("/add/:id", (req, res) => {
  req.session.cart[req.params.id].quantity++;

  //delete req.session.cart.deleteThis;
  res.redirect("/checkout");
});

module.exports = router;
