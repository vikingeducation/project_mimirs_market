const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;


router.get('/', (req, res) => {
  let info = [
    Product.findAll({ include: models.Category }),
    Category.findAll()
  ]
  Promise.all(info)
  .then(infoArray => {
    products = infoArray[0].map(product => product.dataValues);
    categories = infoArray[1].map(category => category.dataValues);
    res.render("products/allProducts", { products, categories });
  })
  .catch(e => res.send(e));
})


// router.get('/products/:id', (req, res) => {
//
// })

module.exports = router;
