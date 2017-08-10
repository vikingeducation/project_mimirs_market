const router = require("express").Router();
const { Product, Category } = require("../models/sequelize");
const h = require("../helpers");

const sortOpts = {
  nameAsc: ["name", "ASC"],
  nameDesc: ["name", "DESC"],
  priceAsc: ["price", "ASC"],
  priceDesc: ["price", "DESC"],
  oldest: ["createdAt", "ASC"],
  newest: ["createdAt", "DESC"]
};

const sortNames = {
  nameAsc: "Name, ascending",
  nameDesc: "Name, decending",
  priceAsc: "Price, ascending",
  priceDesc: "Price, descending",
  oldest: "Oldest First",
  newest: "Newest First"
};

function buildOptions(req, min, max) {
  let options = {
    include: Category,
    where: {
      price: {
        $between: [+(req.query.min || min), +(req.query.max || max)]
      }
    }
  };

  if (!isNaN(req.query.category))
    options.where["CategoryId"] = req.query.category;

  if (sortOpts[req.query.sort]) options["order"] = [sortOpts[req.query.sort]];
  return options;
}

router.get("/", async (req, res) => {
  try {
    const { min, max, range } = await Product.priceRange(
      req.query.min,
      req.query.max
    );
    const products = await Product.findAll(buildOptions(req, min, max));

    let categories = await Category.findAll();
    categories = categories.map(category => {
      if (category.id == req.query.category) category["selected"] = true;
      return category;
    });

    const sorts = Object.entries(sortNames).map(([value, name]) => {
      return { name, value, selected: value == req.query.sort };
    });

    res.render("products/index", { products, categories, range, sorts });
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
