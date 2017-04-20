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
    }).then(products => {
      let total = 0;
      products.forEach(product => {
        product.quantity = cart[product.id];
        product.subtotal = Number(cart[product.id]) * product.price;
        total += product.subtotal;
      });
      res.render("checkouts/new", { products, total });
    });
  } else {
    res.render("checkouts/new", { products });
  }
});

module.exports = router;
