var url = require('url');
const express = require('express');
let router = express.Router();
//var modelsSeq = require('./../models/sequelize');
// var Product = modelsSeq.Product;
// var Category = modelsSeq.Category;
// var sequelize = modelsSeq.sequelize;
var mongoose = require('mongoose');
var modelsMon = require('./../models/mongoose');
var Order = mongoose.model('Order');
var OrderedProduct = mongoose.model('OrderedProduct');

router.get('/', (req, res) => {
  var cartProducts = req.session.shoppingCart;
  Order.find({}).then(orders => {
    res.render('admin/index', { orders, cartProducts });
  });
});

router.get('/:id', (req, res) => {
  Order.findById(req.params.id).then(order => {
    var cartProducts = req.session.shoppingCart;
    var adminProducts = order.shoppingCart;
    res.render('admin/show', { order, adminProducts, cartProducts });
  });
});

module.exports = router;
