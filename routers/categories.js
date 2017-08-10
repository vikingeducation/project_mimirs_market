const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

router.get("/", (req, res) => {
  Category.findAll({ include: Product })
    .then(categories => res.render("categories/index", { categories }))
    .catch(e => res.status(500).send(e.stack));
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) h.missingFlashRedirect(req, res, h.productsPath(), "category");
  else {
    Category.findById(req.params.id, { include: Product })
      .then(category => {
        if (category) res.render("categories/single", { category });
        else h.missingFlashRedirect(req, res, h.productsPath(), "category");
      })
      .catch(e => res.status(500).send(e.stack));
  }
});

module.exports = router;
