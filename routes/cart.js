var url = require('url');
const express = require('express');
let router = express.Router();
var modelsSeq = require('./../models/sequelize');
var Product = modelsSeq.Product;
var Category = modelsSeq.Category;
var sequelize = modelsSeq.sequelize;
var mongoose = require('mongoose');
var modelsMon = require('./../models/mongoose');
var Order = mongoose.model('Order');

// ----------------------------------------
// STRIPE
// ----------------------------------------
var {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
var stripe = require('stripe')(STRIPE_SK);

var totalAmount = function(cartProducts) {
  var total = 0;
  cartProducts.forEach(product => {
    total += Number(product.price) * Number(product.quantity);
  });
  return total;
};

router.get('/', (req, res) => {
  var cartProducts = req.session.shoppingCart;
  var total = totalAmount(cartProducts);
  res.render('cart/index', { cartProducts, total });
});

router.post('/updateQuantity', (req, res) => {
  var quantity = Number(req.body.productQuantity);
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;
  var indexOfRemoval;

  shoppingCart.forEach((product, index) => {
    if (product.id === productId) {
      product.quantity = quantity;
      if (product.quantity <= 0) {
        indexOfRemoval = index;
        console.log('Remove');
      }
    }
  });

  if (indexOfRemoval) shoppingCart.splice(indexOfRemoval, 1);
  if (indexOfRemoval === 0) shoppingCart.shift();

  req.session.shoppingCart = shoppingCart;
  res.redirect('back');
});

router.post('/remove', (req, res) => {
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;
  var indexOfRemoval;

  shoppingCart.forEach((product, index) => {
    if (product.id === productId) {
      indexOfRemoval = index;
    }
  });

  shoppingCart.splice(indexOfRemoval, 1);
  req.session.shoppingCart = shoppingCart;
  res.redirect('back');
});

router.post('/clear', (req, res) => {
  req.session.shoppingCart = [];
  res.redirect('back');
});

router.get('/checkout', (req, res) => {
  var cartProducts = req.session.shoppingCart;
  var total = totalAmount(cartProducts);
  //create description based off of products in cart to send to render?
  res.render('cart/checkout', { cartProducts, STRIPE_PK, total });
});

router.post('/charges', (req, res) => {
  var charge = req.body;
  var shoppingCart = req.session.shoppingCart;
  var total = charge.amount;
  var firstName = charge.first_name;
  var lastName = charge.last_name;
  var street = charge.street;
  var city = charge.city;
  var state = charge.state;
  var email = charge.stripeEmail;
  var stripeToken = charge.stripeToken;
  var stripeTokenType = charge.stripeTokenType;
  var description = '';
  var totalUnits = 0;

  shoppingCart.forEach(function(product, index) {
    if (index != shoppingCart.length - 1) {
      description += product.name + ', ';
    } else {
      description += product.name;
    }

    //for each product, add quantity to that product's unitsSold?

    totalUnits += Number(product.quantity);
  });

  //Look at charge to pull out amount and description?
  stripe.charges
    .create({
      amount: Number(total),
      currency: 'usd',
      description: 'something',
      source: charge.stripeToken
    })
    .then(charge => {
      var newOrder = new Order({
        charge,
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        shoppingCart,
        description,
        stripeToken,
        stripeTokenType,
        totalUnits
      });

      newOrder.save();
    })
    .then(() => {
      var promiseArr = [];

      shoppingCart.forEach(product => {
        promiseArr.push(
          Product.find({ where: { id: product.id } }).then(foundProduct => {
            let newCount = Number(foundProduct.unitsSold) +
              Number(product.quantity);
            Product.update(
              { where: { id: product.id } },
              { unitsSold: newCount }
            );
          })
        );
      });

      Promise.all(promiseArr).then(() => {
        req.session.shoppingCart = [];
        res.redirect('/cart');
      });
      //.catch(() => res.status(500).send(e.stack));
    });
});

module.exports = router;
