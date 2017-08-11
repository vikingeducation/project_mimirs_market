const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SK);
const h = require("../helpers");

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
    console.log(req.session);
    console.log(charge);
    // req.session.cart = {};
    res.redirect("back");
  } catch (e) {
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

router.get("/orders", (req, res) => {
  res.end("orders");
});

router.get("/analytics", (req, res) => {
  res.end("analytics");
});

module.exports = router;
