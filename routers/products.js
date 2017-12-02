const express = require('express');
const router = express.Router();
const sequelizeModels = require('../models/sequelize');
const { Product, Category } = sequelizeModels;
const SearchHandler = require('../lib/searchHandler');

router.get('/', async (req, res) => {
  const categories = await Category.findAll();

  SearchHandler.findProducts(req.query)
    .then(products => {
      res.render('products/index', { products, categories });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
