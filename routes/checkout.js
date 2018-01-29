var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var sequelize = models.sequelize;
const Op = sequelize.Op;
var mongoose = require('mongoose');
var mongooseModels = require('./../models/mongoose');
var Cart = mongoose.model('Cart');
var Categories = mongoose.model('Category')
var Products = mongoose.model('Product');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let sessionCartArr;
  try {
    sessionCartArr = await Cart.find({userId: req.session.userId});
  } catch (e) {
    res.status(500).send(e.stack);
  }
  sessionCart = sessionCartArr[0];
  let itemsArr;
  let prodArray = sessionCart.products;
  let tempVar;
  let total = 0;
  for(let i = 0; i < prodArray.length; i++){
    try {
      tempVar = await Products.find({name: prodArray[i][0]});
    } catch (e) {
      res.status(500).send(e.stack);
    }
    prodArray[i][2] = tempVar[0].price.toString();
    prodArray[i][3] = (Number(prodArray[i][1]) * Number(prodArray[i][2])).toString();
    total += Number(prodArray[i][3]);
  }
  itemsArr = prodArray;
  res.render('checkout', {itemsArr, total, stripeKey: process.env.PUBLIC_KEY, cartID: sessionCart.id});
});

module.exports = router;
