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
        let stripeTotal = parseInt(total * 100);
        res.render("checkouts/new", {
          products,
          total,
          STRIPE_PK,
          stripeTotal
        });
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
    let totalRevenue = 0;
    let totalQuantity = 0;
    let orderProducts = [];

    Product.findAll({
      include: [{ model: Category }],
      where: { id: { $in: keys } }
    })
      .then(products => {
        products.forEach(product => {
          orderProducts.push({
            id: product.id,
            category: product.Category.name,
            name: product.name,
            price: product.price,
            description: product.description,
            sku: product.sku,
            quantity: cart[product.id]
          });
          totalRevenue += Number(cart[product.id]) * product.price;
          totalQuantity += cart[product.id];
        });
        return stripe.charges.create({
          amount: parseInt(totalRevenue.toFixed(2) * 100),
          currency: "usd",
          description: "purchase",
          source: req.body.stripeToken
        });
      })
      .then(charge => {
        let order = req.body.order;
        const newOrder = new Order({
          fname: order.fname,
          lname: order.lname,
          email: order.email,
          street: order.street,
          city: order.city,
          state: order.state,
          products: orderProducts,
          stripe: charge,
          stripeToken: req.body.stripeToken,
          revenue: totalRevenue,
          quantity: totalQuantity
        });
        return newOrder.save();
      })
      .then(order => {
        console.log(order);
        res.cookie("cart", {});
        res.redirect("checkouts/show");
      })
      .catch();
  }
});

router.get("/show", (req, res) => {
  res.render("checkouts/show");
});

module.exports = router;
