const express = require("express");
const router = express.Router();

const sqlModels = require("./../models/sequelize");

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");
const Order = mongoose.model("Order");

const { Product, Category } = sqlModels;

// ----------------------------------------
// Stripe
// ----------------------------------------
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require("stripe")(STRIPE_SK);

router.get("/", (req, res, next) => {
  let products;
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
        res.render("checkouts/new", { products, total });
      })
      .catch(next);
  } else {
    res.render("checkouts/new", { products });
  }
});

router.get('/stripe', (req, res) => {
  res.render('checkouts/stripe', { STRIPE_PK });
});

router.post("/", (req, res) => {
  if (req.cookies.cart) {
    const order = req.body.order;
    res.cookie("order", order);
    res.redirect("/checkouts/stripe");
  } else {
    res.redirect("/products");
  }
});

module.exports = router;
