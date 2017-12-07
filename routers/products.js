const express = require('express');
const app = express();
const router = express.Router();
const { Product, sequelize } = require('../models/sequelize');
const h = require('../helpers');

// ----------------------------------------
// New
// ----------------------------------------
router.get('/new', (req, res) => {
  res.render('products/new');
});

// ----------------------------------------
// Show
// ----------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    res.render('products/show', { product });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
