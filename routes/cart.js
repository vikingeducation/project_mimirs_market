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
      res.render("cart/index", { products, total });
    });
  } else {
    res.render("cart/index", { products });
  }
});

router.post("/", (req, res) => {
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

router.post("/edit", (req, res) => {
  let cart = req.cookies.cart || {};
  const quant = req.body.quantity;
  const id = req.body.id;
  if (quant === "0") {
    delete cart[id];
  } else {
    cart[id] = quant;
  }
  res.cookie("cart", cart);
  res.redirect("back");
});

router.post("/remove", (req, res) => {
  let cart = req.cookies.cart || {};
  const id = req.body.id;
  if (cart) {
    delete cart[id];
  }
  res.cookie("cart", cart);
  res.redirect("back");
});

router.post("/removeAll", (req, res) => {
  res.cookie("cart", {});
  res.redirect("back");
});

module.exports = router;
