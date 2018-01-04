const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models/mongoose');
const { getAllData } = require('./../helpers/analytics_helper');

const router = express.Router();
const Order = mongoose.model('Order');

router.get('/orders', (req, res) => {
  Order.find()
    .then(orders => {
      res.render('admin/index', { orders });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach(err => req.flash('error', err.message));
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/orders/:id', (req, res) => {
  Order.findById(req.params.id)
    .then(order => {
      res.render('admin/show', { order });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach(err => req.flash('error', err.message));
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/analytics', (req, res) => {
  getAllData()
    .then(data => {
      res.render('admin/analytics', { data });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach(err => req.flash('error', err.message));
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;
