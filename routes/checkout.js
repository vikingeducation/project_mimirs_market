const express = require("express");
const router = express.Router();
const states = require("./../lib/states");
const cartBuilder = require("./../lib/sessionBuilder");

router.get("/", (req, res) => {
  const cartItems = cartBuilder(req.session.cart);
  let total = 0;
  cartItems.forEach(product => {
    total += product.total;
  });
  const length = cartItems.length;
  res.render("checkout", { cartItems, length, states, total });
});

module.exports = router;
