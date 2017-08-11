const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const sequelize = models.sequelize;
const helpers = require("../helpers");

router.get("/", (req, res) => {
  let newCart = [];
  let totalCost = 0;
  if (req.session.cart !== undefined) {
    Object.keys(req.session.cart).forEach(function(key) {
      totalCost += req.session.cart[key].quantity * req.session.cart[key].price;
    });
    console.log(totalCost);
    console.log("had a cart");
    req.session.totalCost = totalCost;
    res.render(`register/index`, {
      cart: req.session.cart,
      cost: totalCost
    });
  } else {
    console.log("not a  a cart");
    res.render(`products/index`);
  }
});
//append discounts to the url

router.post("/deleteItem/:id", (req, res) => {
  // if (req.session.cart === undefined) {
  // }
  let deleteThis = req.params.id;
  delete req.session.cart[deleteThis];
  //delete req.session.cart.deleteThis;
  res.redirect("/register");
});
router.post("/subtract/:id", (req, res) => {
  req.session.cart[req.params.id].quantity--;

  //delete req.session.cart.deleteThis;
  res.redirect("/register");
});
router.post("/add/:id", (req, res) => {
  req.session.cart[req.params.id].quantity++;

  //delete req.session.cart.deleteThis;
  res.redirect("/register");
});

module.exports = router;
