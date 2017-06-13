const express = require('express');
const router = express.Router();
const models = require('./../models/sequelize');
const Product = models.Product;
const Category = models.Category;
const h = require('./../helpers/path-helpers').registered;
const sequelize = models.sequelize;

const getTotals = (cart, products) => {
  let total = 0;
  for (let key in cart) {
    products.forEach(product => {
      if (product.id.toString() === key) {
        total += product.price * cart[key]
      }
    });
  }
  return total;
};

router.get('/', (req, res) => {
  let cart = req.session.cart;
  let products = Object.keys(cart.products);

  Product.findAll({
    where: {id: products},
    include: [{model: Category}]
  })
    .then(results => {
      let total = getTotals(cart.products, results);
      res.render('cart/index', { products: results, total });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach((err) => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/:id', (req, res) => {
  let cart = req.session.cart;
  let quantity = req.query.quantity;

  if (quantity <= 0) {
    delete cart.products[req.params.id];
    req.flash('success', 'Product successfully removed.');
  } else {
    cart.products[req.params.id] = quantity;
    req.flash('success', 'Product successfully added/updated!');
  }
  let products = Object.keys(cart.products);
  cart.size = products.length || "Empty";

  res.redirect('back');
});

router.delete('/', (req, res) => {
  req.session.cart.products = {};
  req.session.cart.size = "Empty";
  req.method = 'GET';
  res.redirect(h.cartShowPath());
});

module.exports = router;