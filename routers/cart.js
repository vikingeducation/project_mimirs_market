const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

const cart = async (req, res, next) => {
  // req.session.cart = {};
  const cart = req.session.cart;
  try {
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
  } catch (e) {
    console.error(e.stack);
    req.session.cart = {};
    req.flash("error", "Sorry, cart cleared");
  }

  next();
};

router.get("/", (req, res) => {
  if (!Object.keys(res.locals.cartProducts).length) {
    req.flash(
      "notice",
      "Your cart is empty. Perhaps you'd like to select some items?"
    );
    res.redirect(h.productsPath());
  } else res.render("cart/index");
});

router.delete("/", (req, res) => {
  req.session.cart = {};
  res.redirect(h.productsPath());
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
  if (!+req.body.count) delete req.session.cart[req.params.id];
  else req.session.cart[req.params.id] = +req.body.count;
  res.redirect("back");
});

router.delete("/:id", (req, res) => {
  req.session.cart = req.session.cart || {};
  delete req.session.cart[req.params.id];
  res.redirect("back");
});

module.exports = { cart, router };
