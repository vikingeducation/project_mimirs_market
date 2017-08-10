const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const helpers = require("../helpers/productsHelpers");
const filterFind = require("../dbSequelize/queries");

//
let filterParams = {};

router.get('/', (req, res) => {

  let info = [
    filterFind(filterParams),
    Category.findAll()
  ]

  Promise.all(info)
  .then(infoArray => {
    products = infoArray[0];
    categories = infoArray[1].map(category => category.dataValues);
    res.render("products/allProducts", { products, categories });
  })
  .catch(e => res.send(e));
})

router.post('/filter', (req, res) => {
  filterParams = req.body.filter;

  res.redirect(helpers.productsPath());
})


// router.get('/products/:id', (req, res) => {
//
// })

module.exports = router;
