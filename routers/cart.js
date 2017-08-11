const router = require("express").Router();
const { Product, Category, State } = require("../models/sequelize");
const h = require("../helpers");

// Middleware to prepare cart details
const cart = (req, res, next) => {
  // req.session.cart = undefined;
  const cart = req.session.cart;
  if (cart) {
    let total = 0;
    const products = Object.values(cart).map(cartProduct => {
      let product = cartProduct.product;
      product["count"] = cartProduct.count;
      const subtotal = cartProduct.count * cartProduct.product.price;
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

  next();
};

// Random fake customer
const faker = require("faker");
function fakeCustomer() {
  return {
    fname: faker.name.firstName(),
    lname: faker.name.lastName(),
    email: faker.internet.email(),
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    zip: faker.address.zipCode()
  };
}

// Shopping Cart/Checkout
router.get(["/", "/checkout"], async (req, res) => {
  try {
    if (!Object.keys(res.locals.cartProducts).length) {
      req.flash(
        "notice",
        "Your cart is empty. Perhaps you'd like to select some items?"
      );
      res.redirect(h.productsPath());
    } else if (/\/[^/]*\/checkout(\/.*)?/.test(req.originalUrl)) {
      const states = await State.findAll();
      const customer = fakeCustomer();
      res.render("cart/checkout", { states, customer });
    } else {
      res.render("cart/index");
    }
  } catch (e) {
    console.error(e.stack);
    req.flash("error", "Sorry, I couldn't get your cart");
    res.redirect(h.productsPath());
  }
});

function defaultCart(req, id) {
  if (req.session.cart) {
    req.session.cart[id] = req.session.cart[id] ? req.session.cart[id] : {};
    return req.session.cart;
  } else {
    return { [id]: {} };
  }
}

// C_UD cart
router.delete("/", (req, res) => {
  req.session.cart = {};
  res.redirect(h.productsPath());
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  let cart = defaultCart(req, id);
  const count = +req.body.count;
  if (cart[id].count) {
    cart[id].count += +cart[id].count + count;
  } else {
    try {
      cart[id].count = count;
      cart[id].product = await Product.findById(id, { include: Category });
    } catch (e) {
      console.error(e.stack);
      req.flash("error", "Sorry, I couldn't add that product");
    }
  }

  req.session.cart = cart;
  res.redirect("back");
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  req.session.cart = defaultCart(req, id);
  if (!+req.body.count) delete req.session.cart[id];
  else req.session.cart[id].count = +req.body.count;
  res.redirect("back");
});

router.delete("/:id", (req, res) => {
  req.session.cart = req.session.cart || {};
  delete req.session.cart[req.params.id];
  res.redirect("back");
});

module.exports = { cart, router };
