const express = require("express");
const router = express.Router();
const states = require("./../lib/states");
const getCartInfo = require("./../lib/getCartInfo");
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require("stripe")(STRIPE_SK);

router.get("/", (req, res) => {
  const cart = getCartInfo(req.session.cart);
  res.render("checkout/index", {
    cartItems: cart.cartItems,
    length: cart.length,
    total: cart.total,
    states
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
  req.session.fname = req.body.fname;
  req.session.lname = req.body.lname;
  req.session.email = req.body.email;
  req.session.state = req.body.state;
  req.session.city = req.body.city;
  res.redirect("checkout/new");
});

router.get("/new", (req, res) => {
  const cart = getCartInfo(req.session.cart);
  return res.render("checkout/new", {
    cartItems: cart.cartItems,
    length: cart.length,
    total: cart.total,
    STRIPE_PK
  });
});

module.exports = router;
