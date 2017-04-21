const express = require("express");
const router = express.Router();

const { Product, Category } = require("../models/sequelize");

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  let products;
  let keys = Object.keys(req.cart);
  if (keys.length) {
    Product.findAll({
      include: [{ model: Category }],
      where: { id: { $in: keys } }
    })
    .then(products => {
      let total = 0;
      products.forEach(product => {
        product.quantity = req.cart[product.id];
        product.subtotal = Number(req.cart[product.id]) * product.price;
        total += product.subtotal;
      });
      res.render("cart/index", { products, total });
    });
  } else {
    res.render("cart/index", { products });
  }
});

// ----------------------------------------
// Add to Cart
// ----------------------------------------
router.post("/", (req, res) => {
  const id = req.body.id;
  req.cart[id] ? req.cart[id] += 1 : req.cart[id] = 1;
  res.cookie("cart", req.cart);
  req.flash('success', 'Item added to cart.');
  res.redirect("back");
});

// ----------------------------------------
// Modify Quantity
// ----------------------------------------
router.post("/edit", (req, res) => {
  const quant = +req.body.quantity;
  const id = req.body.id;
  quant <= 0 ? delete req.cart[id] : req.cart[id] = quant;
  res.cookie("cart", req.cart);
  req.flash('success', 'Updated cart.');
  res.redirect("back");
});

// ----------------------------------------
// Remove Item
// ----------------------------------------
router.post("/remove", (req, res) => {
  const id = req.body.id;
  if (req.cart) delete req.cart[id];
  res.cookie("cart", req.cart);
  req.flash('success', 'Item removed from cart.');
  res.redirect("back");
});

// ----------------------------------------
// Clear Cart
// ----------------------------------------
function _clearCart(req, res) {
  res.cookie("cart", {});
  req.flash('success', 'Cart items removed.');
  res.redirect("back");
}
router.get("/clear", _clearCart);
router.post("/clear", _clearCart);

module.exports = router;
