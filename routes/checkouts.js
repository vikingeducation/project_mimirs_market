const express = require("express");
const router = express.Router();

const sqlModels = require("./../models/sequelize");
const sequelize = sqlModels.sequelize;

const { Product, Category } = sqlModels;

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");
const Order = mongoose.model("Order");

// ----------------------------------------
// Stripe
// ----------------------------------------
const {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
const stripe = require("stripe")(STRIPE_SK);

router.get("/", (req, res, next) => {
  let products;
  if (req.cookies.cart) {
    let cart = req.cookies.cart;
    let keys = Object.keys(cart);
    Product.findAll({
      include: [
        {
          model: Category
        }
      ],
      where: {
        id: {
          $in: keys
        }
      }
    })
      .then(products => {
        let total = 0;
        products.forEach(product => {
          product.quantity = cart[product.id];
          product.subtotal = Number(cart[product.id]) * product.price;
          total += product.subtotal;
        });
        res.render("checkouts/new", { products, total, STRIPE_PK });
      })
      .catch(next);
  } else {
    res.render("checkouts/new", { products });
  }
});

router.post("/", (req, res, next) => {
  if (req.cookies.cart) {
    let cart = req.cookies.cart;
    let keys = Object.keys(cart);

    Product.findAll({
      include: [{ model: Category }],
      where: { id: { $in: keys } }
    })
      .then(products => {
        let total = 0;
        products.forEach(product => {
          product.quantity = cart[product.id];
          product.subtotal = Number(cart[product.id]) * product.price;
          total += product.subtotal;
        });
        return stripe.charges.create({
          amount: parseInt(total.toFixed(2) * 100),
          currency: "usd",
          description: "purchase",
          source: req.body.stripeToken
        });
      })
      .then(charge => {
        var newOrder = new Order({
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          products: req.cookies.cart,
          stripe: charge
        });
        return newOrder.save();
      })
      .then(order => {
        res.render("checkouts/show", order);
      })
      .catch();
  }
});

module.exports = router;
