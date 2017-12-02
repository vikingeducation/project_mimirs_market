const express = require('express');
const router = express.Router();
const sequelizeModels = require('../models/sequelize');
const { Product, Category } = sequelizeModels;
const SearchHandler = require('../lib/searchHandler');

const index = async (req, res) => {
  const categories = await Category.findAll();

  SearchHandler.findProducts(req.query)
    .then(products => {
      res.render('products/index', { products, categories });
    })
    .catch(e => res.status(500).send(e.stack));
};

router.get('/', index);
router.get('/products', index);

router.get('/:id', (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: [ { model: Category, as: 'category' } ]
  })
    .then(async (product) => {
      if (!product) throw new Error('404: Product not found')

      let relatedProducts = await SearchHandler.findRelatedProducts(product)

      res.render('products/show', { product, relatedProducts });
    })
    .catch(e => {
      if (e.message) {
        res.status(404).send(e.message);
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;
