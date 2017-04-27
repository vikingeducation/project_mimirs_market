const express = require("express");
const router = express.Router();

const { Product, Category } = require("../models/sequelize");

const mongoose = require("mongoose");
const mongoModels = require("../models/mongoose");
const Order = mongoose.model("Order");

// ----------------------------------------
// Stripe Config
// ----------------------------------------
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require("stripe")(STRIPE_SK);

// ----------------------------------------
// New Checkout
// ----------------------------------------
router.get("/", (req, res, next) => {
  let checkout = { products: [] };
  if (req.cookies.cart) {
    let keys = Object.keys(req.cart);
    Product.findAll({
      include: [{ model: Category }],
      where: { id: { $in: keys } }
    })
      .then(products => {
        let total = 0;
        products.forEach(product => {
          product.quantity = req.cart[product.id];
          product.subtotal = Number((req.cart[product.id] * product.price).toFixed(2));
          total += product.subtotal;
        });
        checkout.products = products;
        checkout.total = Number(total.toFixed(2));
        checkout.stripeTotal = parseInt(total * 100);
        checkout.STRIPE_PK = STRIPE_PK;
        res.render("checkouts/new", { checkout });
      })
      .catch(next);
  } else {
    res.render("checkouts/new", { checkout });
  }
});

// ----------------------------------------
// Payment Submission
// ----------------------------------------
router.post("/", (req, res, next) => {
  if (!req.cookies.cart) {
    res.redirect('back');
  } else {
    let cart = req.cart;
    let order = req.body.order;
    let keys = Object.keys(cart);
    let revenue = 0;
    let quantity = 0;
    let orderedProducts = [];
    let stripeCharge;

    Product.findAll({
      include: [{ model: Category }],
      where: { id: { $in: keys } }
    })
    .then(products => {
      products.forEach(product => {
        orderedProducts.push({
          id: product.id,
          category: product.Category.name,
          name: product.name,
          price: product.price,
          description: product.description,
          sku: product.sku,
          quantity: cart[product.id]
        });
        revenue += Number((cart[product.id] * product.price).toFixed(2));
        quantity += cart[product.id];
      });
      return stripe.charges.create({
        amount: parseInt(revenue * 100),
        currency: "usd",
        description: "purchase",
        source: req.body.stripeToken
      });
    })
    .then(charge => {
      stripeCharge = charge;
      const newOrder = new Order({
        fname: order.fname,
        lname: order.lname,
        email: order.email,
        street: order.street,
        city: order.city,
        state: order.state,
        products: orderedProducts,
        stripe: charge,
        stripeToken: req.body.stripeToken,
        revenue: revenue,
        quantity: quantity
      });
      return newOrder.save();
    })
    .then(order => {
      res.cookie("cart", {});
      res.render("checkouts/show", { order });
    })
    .catch(err => {
      req.flash("danger", "Your order could not be processed.");
      stripe.refunds.create({
        amount: stripeCharge.amount,
        currency: "usd",
        source: req.body.stripeToken
      })
      .then(refund => res.redirect("back"))
      .catch(err => {
        res.redirect("back");
      })
    });
  }
});

// ----------------------------------------
// Protect order confirmation page
// ----------------------------------------
router.get("/show", (req, res) => {
  res.redirect("back");
});

module.exports = router;
