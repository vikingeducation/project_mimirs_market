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

const _searchSettings = settings => {
  const r = (s, i) => {
    s[i] = true;
    return s;
  };

  const defaults = {
    categories: Category.CategoryName.reduce(r, {}),
    price: {
      min: 0,
      max: 10,
    },
  };

  return Object.assign(defaults, settings);
};

// ----------------------------------------
// Search Settings
// ----------------------------------------
app.use((req, res, next) => {
  req.session.searchSettings = _searchSettings(req.session.searchSettings);
  res.locals.searchSettings = req.session.searchSettings;
  next();
});

//query is an object that we want to build
const _buildSearchQuery = req => {
  if (h.isEmpty(req.query)) {
    return {};
  }

  const { categories: categories = Category.CategoryName, price } = req.query;

  return {
    [Op.and]: [
      { category: { [Op.in]: Category.CategoryName } },
      { price: { [Op.between]: [+price.min, +price.max] } },
    ],
  };
};

// const _updateSearchSettings = req => {
//   const r = (s, i) => {
//     s[i] = true;
//     return s;
//   };
//
//   const { categories: categories = [], price = {} } = req.query;
//
//   const updated = {
//     categories: Category.CategoryName.reduce(r, {}),
//     price,
//   };
//
//   return Object.assign(req.session.searchSettings, updated);
// };

// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const query = _buildSearchQuery(req);
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
      ],
      where: query,
    });

    const categories = Category.CategoryName;

    //_updateSearchSettings(req);
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

module.exports = { searchSettings: app, router };
