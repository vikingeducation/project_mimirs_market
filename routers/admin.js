const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SK);
const h = require("../helpers");
const { Item, Order, User } = require("../models/mongoose");

const storeCharge = async (session, body, charge) => {
  let items = Object.values(session.cart).map(product => {
    product = product.product;
    return {
      category: product.Category.name,
      name: product.name,
      id: product.id,
      price: product.price,
      sku: product.sku,
      description: product.description,
      count: product.count
    };
  });
  items = await Item.insertMany(items);
  let userOpts = {
    user: {
      fname: body.fname,
      lname: body.lname,
      email: body.email,
      street: body.street,
      city: body.city,
      zip: body.zip,
      state: body.name
    },
    total: charge.amount,
    date: new Date(charge.created),
    items: items
  };
  const order = await Order.create(userOpts);
  return order;
};

// Stripe charges
router.post("/charges", async (req, res) => {
  try {
    const options = {
      amount: req.session.total,
      currency: "usd",
      description: "Mimir is pleased!",
      source: req.body.stripeToken
    };
    const charge = await stripe.charges.create(options);
    await storeCharge(req.session, req.body, charge);
    req.session.cart = {};
    res.redirect(h.adminOrdersPath());
  } catch (e) {
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("items");
    res.render("admin/orders", { orders });
  } catch (error) {
    res.status(500).end(error.stack);
  }
});

router.get("/analytics", (req, res) => {
  res.end("analytics");
});

module.exports = router;
