const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

function buildOptions(req, priceRange) {
  let options = {
    include: Category,
    where: {
      price: {
        $between: [
          req.query.min || priceRange.min,
          req.query.max || priceRange.max
        ]
      }
    }
  };
  if (!isNaN(req.query.category))
    options.where["CategoryId"] = req.query.category;
  return options;
}

router.get("/", async (req, res) => {
  try {
    const priceRange = await Product.priceRange(req.query.min, req.query.max);
    const categories = (await Category.findAll()).map(category => {
      if (category.id == req.query.category) category["selected"] = true;
      return category;
    });
    const products = await Product.findAll(buildOptions(req, priceRange));
    res.render("products/index", {
      products,
      categories,
      priceRange: priceRange.range
    });
  } catch (e) {
    res.status(500).send(e.stack);
  }
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
