const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

const cart = async (req, res, next) => {
  const cart = req.session.cart;
  if (cart) {
    let products = await Product.findAll({
      include: Category,
      where: { id: { $in: Object.keys(cart) } }
    });
    let total = 0;
    products = products.map(product => {
      product["count"] = cart[product.id];
      total += product.count * product.price;
      return product;
    });
    res.locals.cartProducts = products;
    res.locals.cartTotal = total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  }
  next();
};

router.get("/", (req, res) => {
  res.render("cart/index");
});

router.post("/:id", (req, res) => {
  let cart = req.session.cart || {};
  const id = req.params.id;
  const count = +req.body.count;
  cart[id] = cart[id] ? +cart[id] + count : count;
  req.session.cart = cart;
  res.redirect("back");
});

router.put("/:id", (req, res) => {
  req.session.cart = req.session.cart || {};
  req.session.cart[req.params.id] = +req.body.count;
  res.redirect("back");
});

module.exports = { cart, router };
