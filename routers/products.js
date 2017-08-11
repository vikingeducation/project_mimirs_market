const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const { ProductsHelpers } = require("../helpers");
const { queryFind, getProductPageInfo } = require("../dbSequelize/queries");

//
// let queryParams = {};

router.get('/', (req, res) => {

  let info = [
    queryFind(req.session.queryParams),
    Category.findAll()
  ]

  Promise.all(info)
  .then(infoArray => {
    products = infoArray[0];
    // console.log(products);
    categories = infoArray[1].map(category => category.dataValues);
    let cartQuantity = req.session.cart.length;
    return res.render("index", { products, categories, cartQuantity });
  })
  .catch(e => res.send(e));
})

router.post('/query', (req, res) => {
  req.session.queryParams = req.body;

  res.redirect(ProductsHelpers.productsPath());
})

router.get('/:productId/category/:CategoryId', (req, res) => {
  let productId = req.params.productId;
  let CategoryId = req.params.CategoryId;
  let cartQuantity = req.session.cart.length;

  getProductPageInfo(productId, CategoryId)
  .then((results) => {
    const { productSel, products } = results;
    return res.render('product', { productSel, products, cartQuantity })
  })
})


module.exports = router;
