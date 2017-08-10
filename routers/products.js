const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const helpers = require("../helpers/productsHelpers");
const queryFind = require("../dbSequelize/queries");

//
let queryParams = {};

router.get('/', (req, res) => {

  let info = [
    queryFind(queryParams),
    Category.findAll()
  ]

  Promise.all(info)
  .then(infoArray => {
    products = infoArray[0];
    // console.log(products);
    categories = infoArray[1].map(category => category.dataValues);
    res.render("index", { products, categories });
  })
  .catch(e => res.send(e));
})

router.post('/query', (req, res) => {
  queryParams = req.body;

  res.redirect(helpers.productsPath());
})


// router.get('/products/:id', (req, res) => {
//
// })

module.exports = router;
