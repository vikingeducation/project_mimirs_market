var express = require("express");
var router = express.Router();
const { Product, Category } = require("../models/sequelize");

//show cart route
router.get("/", (req, res) => {
  res.render("cart/show", {
    cart: req.session.cart
  });
});

//add to Cart
router.post("/add", (req, res) => {
  req.session.cart = req.session.cart || [];
  // req.session.cart = [];
  //get the product
  Product.findAll({
    where: { id: req.body.addItem }
  }).then(result => {
    let product = result[0];
    //look for matching products already in cart
    let match = req.session.cart.find(item => {
      return item.id === product.id;
    });
    if (match) {
      //if product already in cart add one
      match.quantity++;
    } else {
      //else throw it in cart
      let item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      };
      req.session.cart.push(item);
    }
    return res.redirect("/");
  });
});
//delete one from cart

//delete all from cart

module.exports = router;
