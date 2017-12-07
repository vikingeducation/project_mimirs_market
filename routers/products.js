var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var onIndex = (req, res) => {

	let searchValue = req.session.searchValue || '';
  let sortOption = req.session.selectedSortOption || 'id-ASC';
  let filterOptionCategory = req.session.filterOptionCategory || '';
  let filterOptionMinPrice = req.session.filterOptionMinPrice || '0';
  let filterOptionMaxPrice = req.session.filterOptionMaxPrice || '5000';

  Product.findAll({
    include: [{ model: Category, required: true }]
  })
  .then(products => {
    return checkIfInCart(req, res, products);
  })
  .then(products => {
    Category.findAll({
    	order: ['name']
    }).then(categories => {
      res.render("products/index", 
        { products, categories, searchValue, 
          sortOption, filterOptionCategory, 
          filterOptionMinPrice, filterOptionMaxPrice });
    });
  });
};

router.get('/', onIndex);
router.get('/products', onIndex);


router.get("/show/:productId", (req, res) => {
  let product;
  Product.find({
    where: { id: req.params.productId },
    include: [{ model: Category, required: true }]
  })
  .then(p => {
    product = checkIfInCart(req, res, [p])[0];
    return Product.findAll({
      where: { categoryId: product.categoryId, id: { $ne: product.id } },
      include: [{ model: Category, required: true }]
    });
  })
  .then(relatedProducts => {
    return checkIfInCart(req, res, relatedProducts);
  })
  .then(relatedProducts => {
    return res.render("products/show", { product, relatedProducts });
  });
});


router.post("/search", (req, res) => {
  let search = req.body.search;
  if (search) {
  	req.session.searchValue = search;
  }

  let searchValue = req.session.searchValue || '';
  let sortOption = req.session.selectedSortOption || 'id-ASC';
  let filterOptionCategory = '';
  let filterOptionMinPrice = '0';
  let filterOptionMaxPrice = '5000';

  Product.findAll({
    where: {
      $or: [{ name: { $regexp: search } }, { description: { $regexp: search } }]
    },
    include: [{ model: Category, required: true }]
  })
  .then(products => {
    return checkIfInCart(req, res, products);
  })
  .then(products => {
  	Category.findAll({
    	order: ['name']
    }).then(categories => {
      res.render("products/index", 
        { products, categories, searchValue, 
          sortOption, filterOptionCategory, 
          filterOptionMinPrice, filterOptionMaxPrice });
    });
	});
});


router.post("/filter", (req, res) => {
  if (req.body.filterOption.category) {
    req.session.filterOptionCategory = req.body.filterOption.category;
  }
  if (req.body.filterOption.minPrice) {
    req.session.filterOptionMinPrice = req.body.filterOption.minPrice;
  }
  if (req.body.filterOption.maxPrice) {
    req.session.filterOptionMaxPrice = req.body.filterOption.maxPrice;
  }

  let searchValue = '';
  let sortOption = req.session.selectedSortOption || 'id-ASC';
  let filterOptionCategory = req.session.filterOptionCategory || '';
  let filterOptionMinPrice = req.session.filterOptionMinPrice || '0';
  let filterOptionMaxPrice = req.session.filterOptionMaxPrice || '5000';

  Product.findAll({
    include: [
      {
        model: Category,
        where: {
          name: { $regexp: req.body.filterOption.category }
        }
      }
    ],
    where: {
      price: {
        $between: [
          req.body.filterOption.minPrice,
          req.body.filterOption.maxPrice
        ]
      }
    }
  })
  .then(products => {
    return checkIfInCart(req, res, products);
  })
  .then(products => {
  	Category.findAll({
    	order: ['name']
    }).then(categories => {
      res.render("products/index", 
        { products, categories, searchValue, 
          sortOption, filterOptionCategory, 
          filterOptionMinPrice, filterOptionMaxPrice });
    });
	});
});


router.post("/sort", (req, res) => {
  if (req.body.sortOption) {
    req.session.selectedSortOption = req.body.sortOption;
  }

  let searchValue = req.session.searchValue || '';
  let sortOption = req.session.selectedSortOption || 'id-ASC';
  let filterOptionCategory = req.session.filterOptionCategory || '';
  let filterOptionMinPrice = req.session.filterOptionMinPrice || '0';
  let filterOptionMaxPrice = req.session.filterOptionMaxPrice || '5000';

  let productIds = Object.keys(req.body.shownProducts).map(
    el => req.body.shownProducts[el]
  );

  let param = req.body.sortOption.split("-")[0];
  let cascade = req.body.sortOption.split("-")[1];

  Product.findAll({
    where: { id: { $in: productIds } },
    include: [{ model: Category, required: true }],
		order: [[param, cascade]]
  })
  .then(products => {
    return checkIfInCart(req, res, products);
  })
  .then(products => {
  	Category.findAll({
    	order: ['name']
    }).then(categories => {
      res.render("products/index", 
        { products, categories, searchValue, 
          sortOption, filterOptionCategory, 
          filterOptionMinPrice, filterOptionMaxPrice });
    });
	});
});

function checkIfInCart(req, res, products) {
  let cart = req.session.cart.map(i => i.id);
  products.forEach((p, i) => {
    if (cart.includes(p.id.toString())) {
      products[i].inCart = true;
    }
  });
  return products;
};

module.exports = router;