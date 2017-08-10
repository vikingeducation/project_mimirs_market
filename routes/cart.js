const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let products = [];
  let total = 0;
  let length = Object.keys(req.session.cart).length;
  Object.keys(req.session.cart).forEach(productId => {
    products.push(req.session.cart[productId]);
    let quantity = req.session.cart[productId].quantity;
    let price = req.session.cart[productId].price;
    total += quantity * price;
  });
  res.render("cart", { products, total, length });
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
  console.log(newQuantity);
  req.session.cart[id].quantity = newQuantity;
  res.redirect("/cart");
});

module.exports = router;
