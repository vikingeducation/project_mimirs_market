const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;

router.get('/', (req, res) => {
  Product.findAll({ include: models.Category })
  .then(products => {
    // console.log(products);
    // parse data first
    products = products.map(item => item.dataValues);
    return res.render("products/allProducts", { products })
  })
  .catch(e => res.send(e));
})

module.exports = router;
