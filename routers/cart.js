const router = require("express").Router();
const { Product, Category, State } = require("../models/sequelize");
const h = require("../helpers");
const stripe = require("stripe")(process.env.STRIPE_SK);

// Middleware to prepare cart details
const cart = async (req, res, next) => {
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
        const subtotal = product.count * product.price;
        product["subtotal"] = h.prettyPrice(subtotal);
        total += subtotal;
        return product;
      });
      req.session.total = total;
      res.locals.cartProducts = products;
      res.locals.centTotal = total * 100;
      res.locals.cartTotal = h.prettyPrice(total);
      res.locals.STRIPE_PK = process.env.STRIPE_PK;
    }
  } catch (e) {
    console.error(e.stack);
    req.session.cart = {};
    req.flash("error", "Sorry, cart cleared");
  }

  next();
};

// Strip charges
router.post("/charges", async (req, res) => {
  try {
    const options = {
      amount: req.session.total,
      currency: "usd",
      description: "Mimir is pleased!",
      source: req.body.stripeToken
    };
    const charge = await stripe.charges.create(options);
    console.log(charge);
    // req.session.cart = {};
    res.redirect("back");
  } catch (e) {
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Shopping Cart/Checkout
router.get(["/", "/checkout"], async (req, res) => {
  if (!Object.keys(res.locals.cartProducts).length) {
    req.flash(
      "notice",
      "Your cart is empty. Perhaps you'd like to select some items?"
    );
    res.redirect(h.productsPath());
  } else if (/\/[^/]*\/checkout(\/.*)?/.test(req.originalUrl)) {
    const states = await State.findAll();
    res.render("cart/checkout", { states });
  } else {
    res.render("cart/index");
  }
  console.log(req.originalUrl);
});

// C_UD cart
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
