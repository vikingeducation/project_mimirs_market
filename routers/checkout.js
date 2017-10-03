var express = require("express");
var router = express.Router();
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

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
      res.render("checkout/process", { total });
    });
  });

  router.post("/process", (req, res) => {
    res.redirect("/checkout");
  });

  return router;
};
