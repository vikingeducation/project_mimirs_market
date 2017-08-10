const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");
const queryMap = {
  category: id => {
    if (id === undefined) return "CategoryId";
    return { $eq: id };
  }
};

router.get("/", (req, res) => {
  let options = { include: Category, where: {} };
  Object.entries(req.query).forEach(([key, value]) => {
    if (!queryMap[key]) return;
    options.where[queryMap[key]()] = queryMap[key](value);
  });
  Product.findAll(options)
    .then(products => [products, Category.findAll()])
    .spread((products, categories) => {
      categories = categories.map(category => {
        if (category.id == req.query.category) category["selected"] = true;
        return category;
      });
      res.render("products/index", { products, categories });
    })
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
