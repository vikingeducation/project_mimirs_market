const express = require("express");
const router = express.Router();
var modelsSeq = require("./../models/sequelize");
var Product = modelsSeq.Product;
var Category = modelsSeq.Category;
var sequelize = modelsSeq.sequelize;
var mongoose = require("mongoose");
var modelsMon = require("./../models/mongoose");
var Order = mongoose.model("Order");
var OrderedProduct = mongoose.model("OrderedProduct");

// ----------------------------------------
// STRIPE
// ----------------------------------------
var {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
var stripe = require("stripe")(STRIPE_SK);

// --------------------------------------
// TOTAL AMOUNT
// --------------------------------------
var totalAmount = function(cartProducts) {
  var total = 0;
  cartProducts.forEach(product => {
    total += product.price * product.quantity;
  });
  return total;
};

// ----------------------------------------
// ROUTER FUNCTIONS
// ----------------------------------------

var onCart = (req, res) => {
  var cartProducts = req.session.shoppingCart;
  var total = totalAmount(cartProducts);
  res.render("cart/index", { cartProducts, total });
};

var onCheckout = (req, res) => {
  var cartProducts = req.session.shoppingCart;
  var total = totalAmount(cartProducts);
  res.render("cart/checkout", { cartProducts, STRIPE_PK, total });
};

var onUpdate = (req, res) => {
  var quantity = req.body.productQuantity;
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;
  var indexOfRemoval;

  shoppingCart.forEach((product, index) => {
    if (product.id === productId) {
      product.quantity = quantity;
      if (product.quantity <= 0) {
        indexOfRemoval = index;
      }
    }
  });
  if (indexOfRemoval >= 0) shoppingCart.splice(indexOfRemoval, 1);

  req.session.shoppingCart = shoppingCart;
  req.flash("success", "Succesfully updated!");
  res.redirect("back");
};

var onRemove = (req, res) => {
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
  req.flash("success", "Item removed!");
  res.redirect("back");
};

var onClear = (req, res) => {
  req.session.shoppingCart = [];
  req.flash("success", "Cart is empty!");
  res.redirect("back");
};

var onCharges = (req, res) => {
  var charge = req.body;
  var shoppingCart = req.session.shoppingCart;
  var total = Number(charge.amount);
  var firstName = charge.first_name;
  var lastName = charge.last_name;
  var street = charge.street;
  var city = charge.city;
  var state = charge.state;
  var email = charge.stripeEmail;
  var stripeToken = charge.stripeToken;
  var stripeTokenType = charge.stripeTokenType;
  var description = "";
  var totalUnits = 0;

  shoppingCart.forEach(function(product, index) {
    if (index != shoppingCart.length - 1) {
      description += product.name + ", ";
    } else {
      description += product.name;
    }
    totalUnits += Number(product.quantity);
  });

  stripe.charges
    .create({
      amount: parseInt(total * 100),
      currency: "usd",
      description: "something",
      source: charge.stripeToken
    })
    .then(charge => {
      var newOrder = new Order({
        charge,
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        shoppingCart,
        description,
        stripeToken,
        stripeTokenType,
        totalUnits,
        total
      });

      newOrder.save();
    })
    .then(() => {
      req.session.shoppingCart = [];
      req.flash("success", "Your order is submitted!");
      res.redirect("/cart");
    })
    .catch(() => res.status(500).send(e.stack));
};

router.get("/", onCart);
router.get("/checkout", onCheckout);
router.post("/updateQuantity", onUpdate);
router.post("/remove", onRemove);
router.post("/clear", onClear);
router.post("/charges", onCharges);

module.exports = router;
