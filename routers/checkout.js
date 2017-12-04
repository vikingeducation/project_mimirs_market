const express = require('express');
const router = express.Router();
const sequelizeModels = require('../models/sequelize');
const { Product, Category } = sequelizeModels;
const mongoModels = require('../models/mongoose');
const { Transaction } = mongoModels;
const SearchHandler = require('../lib/searchHandler');
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require('stripe')(STRIPE_SK);

router.get('/', (req, res) => {
  SearchHandler.findCartProducts(res.locals.cart)
    .then(products => {
      const totalPrice = getTotalPrice(products, res.locals.cart);
      res.render('checkout/index', { products, totalPrice, STRIPE_PK });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post('/', (req, res) => {
  const { fname, lname, street, city, state, zip, stripeEmail, amount, stripeToken } = req.body

  if (fname && lname && street && city && state && zip) {
    stripe.charges.create({
      amount: amount,
      currency: "usd",
      description: `Mimir's Market charge for ${ stripeEmail }`,
      source: stripeToken,
    })
      .then(charge => {
        let transaction = new Transaction(charge);

        for (let attrname in req.body) {
          transaction.set(attrname, req.body[attrname]);
        }

        transaction.set('products', res.locals.cart);

        return transaction.save();
      })
      .then((t) => {
        debugger;
        res.clearCookie('cart');
        req.flash('success', "Thank you for your order!")
        res.redirect('/products');
      })
      .catch(e => res.status(500).send(e.stack));
    } else {
      req.flash('error', 'All personal information fields are required');
    }
});

router.get('/cart', (req, res) => {
  SearchHandler.findCartProducts(res.locals.cart)
    .then(products => {
      const totalPrice = getTotalPrice(products, res.locals.cart);
      res.render('checkout/cart', { products, totalPrice });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post('/update', (req, res) => {
  let productId = req.body.productId;
  let quantity = parseInt(req.body.quantity);
  let cart = res.locals.cart;

  if (productId && quantity) {
    cart[productId].quantity = quantity;
  } else {
    delete cart[productId];
  }

  cart = JSON.stringify(cart);

  res.cookie('cart', cart);
  res.redirect('/checkout/cart');
});

router.delete('/', (req, res) => {
  res.clearCookie('cart');
  res.redirect('/checkout/cart');
});

router.delete('/:id', (req, res) => {
  let productId = req.params.id;
  let cart = res.locals.cart;

  delete cart[productId];
  cart = JSON.stringify(cart);

  res.cookie('cart', cart);
  res.redirect('/checkout/cart');
});

function getTotalPrice(products, cart) {
  let price = 0;

  for (let product of products) {
    price += product.price * cart[product.id].quantity
  }

  return price;
}

module.exports = router;
