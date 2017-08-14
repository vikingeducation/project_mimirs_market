const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const { ProductsHelpers } = require("../helpers");
const { queryFind, getProductPageInfo } = require("../controller/queries");

router.get('/', (req, res) => {
  console.log("made it here");
  let info = [
    queryFind(req.session.queryParams),
    Category.findAll()
  ]

  Promise.all(info)
  .then(infoArray => {
    products = infoArray[0];
    let cart = req.session.cart;
    let cartProductIds = [];
    if(cart) {
      cart.forEach((cartProduct) => {
        cartProductIds.push(cartProduct.productId);
      })
    }

    products.forEach((product) => {
      product.inCart = cartProductIds.includes(product.id) ? [true] : []
    })

    categories = infoArray[1].map(category => category.dataValues);
    let cartQuantity = req.session.cart ? req.session.cart.length : 0

    return res.render("index", { products, categories, cartQuantity });
  })
  .catch(e => res.send(e));
})

router.post('/query', (req, res) => {
  req.session.queryParams = req.body;

  res.redirect(ProductsHelpers.productsPath());
})

router.get('/:productId/category/:CategoryId', (req, res) => {
  let productId = req.params.productId;
  let CategoryId = req.params.CategoryId;

  getProductPageInfo(productId, CategoryId)
  .then((results) => {
    let cartQuantity = req.session.cart.length;
    let cart = req.session.cart;
    let cartProductIds = [];
    if(cart) {
      cart.forEach((cartProduct) => {
        cartProductIds.push(cartProduct.productId);
      })
    }

    results.products.forEach((product) => {
      product.inCart = cartProductIds.includes(product.id) ? [true] : []
    })

    results.productSel[0].inCart = cartProductIds.includes(results.productSel[0].id) ? [true] : []
    console.log(`productSel inCart: ${results.productSel.inCart}`)

    const { productSel, products } = results;
    return res.render('product', { productSel, products, cartQuantity })
  })
})


module.exports = router;
