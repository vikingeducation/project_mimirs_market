const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;

const { Product, Category } = models;

// ----------------------------------------
// Stripe
// ----------------------------------------
const {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
const stripe = require('stripe')(STRIPE_SK);


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
      res.render("checkouts/new", { products, total });
    })
    .catch(next);
  } else {
    res.render("checkouts/new", { products });
  }
});

router.post('/checkouts', (req, res, next) => {
  
});

module.exports = router;
