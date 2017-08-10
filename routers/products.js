const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");
const filterMap = {
  category: id => {
    if (id === undefined) return "CategoryId";
    return { $eq: id };
  },
  min: value => {
    if (value === undefined) return "price";
    return { $gte: value };
  },
  max: value => {
    if (value === undefined) return "price";
    return { $lte: value };
  }
};

router.get("/", (req, res) => {
  let options = { include: Category, where: { $and: {} } };
  Object.entries(req.query).forEach(([key, value]) => {
    if (!value || !filterMap[key]) return;
    options.where.$and[filterMap[key]()] = filterMap[key](value);
  });
  console.log(options);
  Promise.all([
    Product.findAll(options),
    Product.priceRange(req.query.min, req.query.max),
    Category.findAll()
  ])
    .then(([products, priceRange, categories]) => {
      categories = categories.map(category => {
        if (category.id == req.query.category) category["selected"] = true;
        return category;
      });
      res.render("products/index", { products, categories, priceRange });
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
