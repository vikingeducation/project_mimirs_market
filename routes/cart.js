const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;

const { Product, Category } = models;

router.get("/", (req, res) => {
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
        products.forEach(product => {
          product.quantity = cart[product.id];
        });
        res.render("cart/index", { products });
      });
  } else {
    res.render("cart/index", { products });
  }
});

router.post('/', (req, res) => {
  let cart = req.cookies.cart || {};
  const id = req.body.id;
  if (cart[id]) {
    cart[id] += 1;
  } else {
    cart[id] = 1;
  }
  res.cookie("cart", cart);
  res.redirect("back");
});

module.exports = router;
