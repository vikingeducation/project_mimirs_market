var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
const Product = models.Product;

router.get("/", (req, res) => {
  Product.findAll({ include: models.Category })
    .then(products => {
      res.render("products/index", { products });
    })
    .catch(e => res.status(500).send(e.stack));
});

// ----------------------------------------
// Add
// ----------------------------------------
// router.get("/add", (req, res) => {
//   res.render("users/new");
// });

router.get("/:id", (req, res) => {
  Product.findById(req.params.id, {
    include: {
      model: models.Category,
      include: { model: models.Product, where: { id: { $ne: req.params.id } } }
    }
  })
    .then(product => {
      console.log(product);
      res.render("products/single", { product });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
