const express = require('express');
const router = express.Router();
const mongooseModels = require('../models/mongoose');
const { Transaction } = mongooseModels;
const AdminAnalytics = require('../lib/adminAnalytics');
const SearchHandler = require('../lib/searchHandler');


router.get('/orders', (req, res) => {
  Transaction.find()
    .then(orders => {
      res.render('admin/orders/index', { orders });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.get('/orders/:id', (req, res) => {
  const orderData = {};

  Transaction.findById(req.params.id)
    .then(order => {
      if (!order) throw '404: Order not found';
      orderData.order = order;
      return SearchHandler.findCartProducts(order._doc.products)
    })
    .then(products => {
      orderData.products = products;
      res.render('admin/orders/show', { orderData });
    })
    .catch(e => {
      if (e == '404: Order not found') {
        res.status(404).send(e);
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/analytics', (req, res) => {
  AdminAnalytics.get()
    .then(analytics => {
      res.render('admin/analytics/index', { analytics });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
