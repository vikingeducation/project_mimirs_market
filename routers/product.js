var express = require("express");
var router = express.Router();
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

module.exports = app => {
  router.get("/:id", (req, res) => {
    Product.findAll({
      where: {
        id: req.session.cart
      }
    }).then(cart => {
      res.locals.cart = cart;
      res.locals.cartQuanity = req.session.cartQuanity;
      res.locals.cookieCart = req.session.cart;
      Product.findAll({
        where: { id: req.params.id },
        include: [Category]
      }).then(mainProduct => {
        Product.findAll({
          where: { categoryId: mainProduct[0].categoryId },
          include: [Category]
        }).then(productsByCategory => {
          mainProduct = mainProduct[0];
          res.render("product/start", { mainProduct, productsByCategory });
        });
      });
    });
  });

  router.get("/addToCart/:id", (req, res) => {
    if (req.session.cart === null || req.session.cart === undefined) {
      req.session.cart = [req.params.id];
      req.session.cartQuanity = [1];
    } else if (req.session.cart.indexOf(req.params.id) > -1) {
      var cartIndex = req.session.cart.indexOf(req.params.id);
      req.session.cartQuanity[cartIndex]++;
    } else {
      req.session.cart.push(req.params.id);
      req.session.cartQuanity.push(1);
    }
    res.redirect("back");
  });
  return router;
};
