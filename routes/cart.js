const express = require("express");
const router = express.Router();
const getCartInfo = require("./../lib/getCartInfo");

router.get("/", (req, res) => {
  const cartItems = getCartInfo(req.session.cart);
  res.render("cart/index", { cartItems });
});

router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  delete req.session.cart[id];
  res.redirect("/cart");
});

router.get("/deleteCart", (req, res) => {
  req.session.cart = {};
  res.redirect("/cart");
});

router.post("/updateQuantity", (req, res) => {
  const id = req.body.id;
  const newQuantity = req.body.quantity;
  req.session.cart[id].quantity = newQuantity;
  res.redirect("/cart");
});

module.exports = router;
