const express = require("express");
const router = express.Router();
const { Product } = require("../models/sequelize");

//render cart page
router.get("/", (req, res) => {
  return res.render("cart/index");
});

//add to session cart, redirect
router.post("/add", (req, res) => {
  let item = { id: req.body.itemId, quantity: 1 };
  req.session.cart.push(item);
  if (req.body.addedFromShow === "true") {
    return res.redirect(`/products/show/${item.id}`);
  }
  if (req.body.addedFromRelated === "true") {
    return res.redirect(`/products/show/${req.body.currentShowPageId}`);
  }
  return res.redirect("/");
});

//reset session cart, redirect
router.put("/clear", (req, res) => {
  req.session.cart = [];
  req.method = "GET";
  return res.redirect("/cart");
});

//
router.patch("/edit", (req, res) => {
  let newQuantity = Number(req.body.newQuantity);
  let item = req.body.newQuantityItem;
  if (typeof newQuantity === "number" && newQuantity > 0) {
    req.session.cart.forEach(i => {
      if (i.id === item) {
        i.quantity = newQuantity;
      }
    });
    req.method = "GET";
    return res.redirect("/cart");
  } else {
    if (newQuantity === 0) {
      req.session.cart.forEach((i, ix) => {
        if (i.id === item) {
          req.session.cart.splice(ix, 1);
        }
      });
      req.method = "GET";
      return res.redirect("/cart");
    } else {
      let err = "Please enter a number.";
      return res.render("cart/index", { err });
    }
  }
});

//find cart item, remove item, redirect
router.delete("/delete", (req, res) => {
  req.session.cart.forEach((i, ix) => {
    if (i.id === req.body.delete) {
      req.session.cart.splice(ix, 1);
    }
  });
  if (req.body.checkoutPage) {
    req.method = "GET";
    return res.redirect("/checkout");
  } else {
    req.method = "GET";
    return res.redirect("/cart");
  }
});

module.exports = router;
