const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

router.get("/", (req, res) => {
  Product.findAll({ include: Category })
    .then(products => res.render("products/index", { products }))
    .catch(e => res.status(500).send(e.stack));
});

// add to cart
// router.get("/add", (req, res) => {
//   res.render("users/new");
// });

router.get("/:id", (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) h.missingFlashRedirect(req, res, h.productsPath(), "product");
  else {
    Product.findById(id, {
      include: {
        model: Category,
        include: { model: Product, where: { id: { $ne: id } } }
      }
    })
      .then(product => {
        if (product) res.render("products/single", { product });
        else h.missingFlashRedirect(req, res, h.productsPath(), "product");
      })
      .catch(e => res.status(500).send(e.stack));
  }
});

module.exports = router;
