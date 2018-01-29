var express = require('express');
var router = express.Router();
const stripe = require('stripe')(process.env.PRIVATE_KEY);
const models = require('../models/sequelize');
const Order = models.order;
const Sale = models.sale;
const mongoose = require('mongoose');
var mongooseModels = require('./../models/mongoose');
var Cart = mongoose.model('Cart');
var Product = mongoose.model('Product');

router.post('/', async(req, res, next) => {
  const token = req.body.stripeToken;
  let orderTotal = Number(req.body.orderTotal);
  let charges = await stripe.charges.create({
    amount: orderTotal * 100,
    currency: 'usd',
    description: 'test charge',
    source: token
  })
  let newOrder = Order.build({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    address: req.body.streetAddress,
    state: req.body.state,
    order_total: req.body.orderTotal,
    stripe_token: token,
    token_type: req.body.stripeTokenType,
    card_id: charges.id,
    card_brand: charges.source.brand
  })
  let salesArray = [];
  let userCart
  try{
    await newOrder.save();
    userCart = await Cart.findById(req.body.cartid);
    for(let i = 0; i < userCart.products.length; i++){
      let currentProduct = await Product.find({name: userCart.products[i][0]});
      let newSale = Sale.build({
        item_id: currentProduct[0]._id.toString(),
        category:currentProduct[0].categoryId,
        price: currentProduct[0].price,
        quantity: Number(userCart.products[i][1])
      })
      await newSale.save();
    }
    await Cart.findByIdAndRemove(req.body.cartid);
    res.redirect('/');
  }catch(e){
    res.status(500).send(e.stack);
  }
});

module.exports = router;
