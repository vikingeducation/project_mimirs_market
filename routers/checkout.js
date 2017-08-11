var express = require("express");
var router = express.Router();
const { Product, Category } = require("../models/sequelize");

//checkout route
router.get("/", (req, res) => {
  return res.render("cart/checkout", {
    cart: req.session.cart,
    total: getTotal(req.session.cart)
  });
});

module.exports = router;

//util functions
function getTotal(cart) {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}
