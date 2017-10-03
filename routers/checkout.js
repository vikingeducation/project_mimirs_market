var express = require("express");
var router = express.Router();
//sequelize
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;
//mongoose
const mongoose = require("mongoose");
var modelsM = require("./../models/mongoose");
var Admin = mongoose.model("Admin");
//Stripe
var { STRIPE_SK, STRIPE_PK } = process.env;
var stripe = require("stripe")(STRIPE_SK);

module.exports = app => {
  router.get("/", (req, res) => {
    Product.findAll({
      where: {
        id: req.session.cart
      },
      include: [Category]
    }).then(cart => {
      var cartQ = req.session.cartQuanity;
      res.locals.cart = cart;
      res.locals.cartQuanity = req.session.cartQuanity;
      var total = 0;
      for (var i = 0; i < cart.length; i++) {
        total += cart[i].price * cartQ[i];
      }
      res.render("checkout/start", { total });
    });
  });

  router.post("/update", (req, res) => {
    var cart = req.session.cart;
    var cartQ = req.session.cartQuanity;
    if (req.body.action === "update" && req.body.newValue > 0) {
      cartQ[Number(req.body.location)] = Number(req.body.newValue);
    } else if (req.body.action === "delete" || req.body.newValue <= 0) {
      cartQ.splice(Number(req.body.location), 1);
      cart.splice(Number(req.body.location), 1);
    } else if (req.body.action === "deleteAll") {
      cart = [];
      cartQ = [];
    }
    req.session.cart = cart;
    req.session.cartQuanity = cartQ;
    res.redirect("/checkout");
  });

  router.get("/process", (req, res) => {
    Product.findAll({
      where: {
        id: req.session.cart
      },
      include: [Category]
    }).then(cart => {
      var cartQ = req.session.cartQuanity;
      res.locals.cart = cart;
      res.locals.cartQuanity = req.session.cartQuanity;
      var total = 0;
      for (var i = 0; i < cart.length; i++) {
        total += cart[i].price * cartQ[i];
      }
      res.render("checkout/process", { total, STRIPE_PK });
    });
  });

  router.post("/process", (req, res) => {
    var charge = req.body;
    stripe.charges
      .create({
        amount: charge.total,
        currency: "usd",
        description: charge.cartDescript + "...",
        source: charge.stripeToken
      })
      .then(charge => {
        // ... Save charge and session data
        // from checkout and cart
        // to MongoDB

        var newAdmin = new Admin({
          description: req.body.cartDescript,
          revenue: Number(req.body.total),
          orderedId: req.session.cart,
          orderedQuanity: req.session.cartQuanity,
          customer: {
            fname: req.body.name.fname,
            lname: req.body.name.lname,
            email: req.body.email,
            address: {
              street: req.body.address.street,
              city: req.body.address.city,
              state: req.body.address.state
            }
          },
          order: {
            checkoutDate: new Date(),
            stripeToken: req.body.stripeToken,
            cardType: req.body.stripeTokenType,
            email: req.body.stripeEmail
          }
        });
        newAdmin.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("saved");
          }
        });
        req.session.cart = [];
        req.session.cartQuanity = [];
        console.log("deleted cart");
      })
      .then(() => {
        // Redirect or render here
        res.redirect("/checkout");
      })
      .catch(e => res.status(500).send(e.stack));
  });

  return router;
};
