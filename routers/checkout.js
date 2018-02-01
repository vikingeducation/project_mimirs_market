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

router.post('/', async (req, res) => {
  const { fname, lname, street, city, state, zip, stripeEmail, amount, stripeToken } = req.body;
  const products = await getProducts(req.body.productRevenue, res.locals.cart);

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
        transaction.set('amount', parseInt(amount));
        transaction.set('products', products);

        const totalUnits = getTotalUnits(products);
        transaction.set('totalUnits', totalUnits);

        return transaction.save();
      })
      .then((t) => {
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

  res.cookie('cart', JSON.stringify(cart));
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

  res.cookie('cart', JSON.stringify(cart));
  res.redirect('/checkout/cart');
});

function getTotalPrice(products, cart) {
  let total = 0;

  for (let { id, price } of products) {
    total += price * cart[id].quantity
  }
  return total;
}

function getTotalUnits(cart) {
  return Object.values(cart).reduce((total, qty) => total + qty);
}

function getProducts(revenues, cart) {
  return new Promise(async (resolve, reject) => {
    let products = Object.assign({}, cart);

    for (let id of Object.keys(revenues)) {
      let [ _, productId ] = id.split('-');

      // set revenue
      products[productId].revenue = parseInt(revenues[id]);

      //set category
      let product = await SearchHandler.findProductById(productId);
      products[productId].category = product.category.name;
    }

    resolve(products);
  });
}

module.exports = router;
