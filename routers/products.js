const express = require('express');
const app = express();
const router = express.Router();
const {
  Product,
  sequelize,
  Category,
  Sequelize: { Op },
} = require('../models/sequelize');
const h = require('../helpers');

// ----------------------------------------
// Build Query Settings
// ----------------------------------------
//query is an object that we want to pass into the the query of Products
const _buildSearchQuery = req => {
  //if query object is empty, then return an empty query object
  if (h.isEmpty(req.query)) {
    return {};
  }

  const { categories: categories = Category.CategoryName, price } = req.query;
  return {
    price: { [Op.between]: [+price.min, +price.max] },
  };
};

// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', async (req, res, next) => {
  try {
    //query is an object that has the search queries
    const query = _buildSearchQuery(req);
    const products = await Product.findAll({
      include: Category,
      where: query, //pass in query object
    });

    const categories = await Category.findAll({});

    res.render('products/index', { products, categories });
  } catch (e) {
    next(e);
  }
});

// ----------------------------------------
// Show
// ----------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id, {
      include: Category,
    });
    console.log(product);
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
