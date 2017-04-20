var url = require("url");
const express = require("express");
let router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

// ----------------------------------------
// STRIPE
// ----------------------------------------
var {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
var stripe = require("stripe")(STRIPE_SK);

var totalAmount = function(cartProducts) {
  var total = 0;
  cartProducts.forEach(product => {
    total += Number(product.price) * Number(product.quantity);
  });
  return total;
};

router.get("/", (req, res) => {
  var cartProducts = req.session.shoppingCart;
  var total = totalAmount(cartProducts);
  res.render("cart/index", { cartProducts, total });
});

router.post("/updateQuantity", (req, res) => {
  var quantity = req.body.productQuantity;
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;

  shoppingCart.forEach(product => {
    if (product.id === productId) {
      product.quantity = quantity;
    }
  });

  req.session.shoppingCart = shoppingCart;
  res.redirect("back");
});

router.post("/remove", (req, res) => {
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;
  var indexOfRemoval;

  shoppingCart.forEach((product, index) => {
    if (product.id === productId) {
      indexOfRemoval = index;
    }
  });

  shoppingCart.splice(indexOfRemoval, 1);
  req.session.shoppingCart = shoppingCart;
  res.redirect("back");
});

router.post("/clear", (req, res) => {
  req.session.shoppingCart = [];
  res.redirect("back");
});

router.get("/checkout", (req, res) => {
  var cartProducts = req.session.shoppingCart;
  var total = totalAmount(cartProducts);
  //create description based off of products in cart to send to render?
  res.render("cart/checkout", { cartProducts, STRIPE_PK, total });
});

router.post("/charges", (req, res) => {
  var charge = req.body;
  console.log("CHARGE", charge);
  var total = req.body.amount;
  //Look at charge to pull out amount and description?
  stripe.charges
    .create({
      amount: Number(total),
      currency: "usd",
      description: "something",
      source: charge.stripeToken
    })
    .then(charge => {
      console.log("INSIDE then", charge);
      //charge object is the larger object
      //create shallow object for useful charge data?
      // ... Save charge and session data
      // from checkout and cart
      // to MongoDB
    })
    .then(() => {
      // Redirect or render here
    })
    .catch(() => res.status(500).send(e.stack));
});

module.exports = router;
