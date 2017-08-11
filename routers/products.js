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

function buildOptions(query, min, max) {
  let options = {
    include: Category,
    where: {
      price: {
        $between: [+(query.min || min), +(query.max || max)]
      }
    }
  };

  if (!isNaN(query.category)) options.where["CategoryId"] = query.category;

  if (sortOpts[query.sort]) options["order"] = [sortOpts[query.sort]];

  if (query.search) {
    options.where["$or"] = {
      name: { $iLike: `%${query.search}%` },
      description: { $iLike: `%${query.search}%` }
    };
  }
  return options;
}

function buildRange(query, min, max, steps) {
  steps = steps || 30;
  let increment = (max - min) / steps;
  let range = [];
  for (let i = 0; i <= steps; i++) {
    let step = Math.round(min + i * increment);
    range.push({
      value: step,
      pretty: h.prettyPrice(step),
      min: step == query.min,
      max: step == query.max
    });
  }
  return range;
}

router.get("/", async (req, res) => {
  const query = req.query;
  try {
    const [min, max] = await Product.priceRange();
    const range = buildRange(query, min, max);

    let products = await Product.findAll(buildOptions(query, min, max));
    products = h.productsCart(products, req.session.cart);

    let categories = await Category.findAll();
    categories = categories.map(category => {
      if (category.id == query.category) category["selected"] = true;

      return category;
    });

    const sorts = Object.entries(sortNames).map(([value, name]) => {
      return { name, value, selected: value == query.sort };
    });

    res.render("products/index", {
      products,
      categories,
      range,
      sorts,
      search: query.search
    });
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) h.missingFlashRedirect(req, res, h.productsPath(), "product");
  else {
    try {
      const options = {
        include: {
          model: Category,
          include: {
            model: Product,
            where: { id: { $ne: id } },
            limit: 10
          }
        }
      };
      let product = await Product.findById(id, options);
      if (product) {
        product = h.productCart(product, req.session.cart);
        res.render("products/single", { product });
      } else h.missingFlashRedirect(req, res, h.productsPath(), "product");
    } catch (e) {
      console.error(e.stack);
      res.status(500).send(e.stack);
    }
  }
});

module.exports = router;
