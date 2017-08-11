const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

router.get("/", (req, res) => {
  Category.findAll({ include: Product, order: [["name", "ASC"]] })
    .then(categories => res.render("categories/index", { categories }))
    .catch(e => res.status(500).send(e.stack));
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    h.missingFlashRedirect(req, res, h.productsPath(), "category");
  } else {
    try {
      let category = await Category.findById(req.params.id, {
        include: Product
      });
      if (category) {
        category.Products = h.productsCart(category.Products, req.session.cart);
        res.render("categories/single", { category });
      } else {
        h.missingFlashRedirect(req, res, h.productsPath(), "category");
      }
    } catch (e) {
      console.error(e);
      res.status(500).send(e.stack);
    }
  }
});

module.exports = router;
