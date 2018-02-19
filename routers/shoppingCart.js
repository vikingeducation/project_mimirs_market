var express = require('express');
var router = express.Router();

const models = require('./../models/sequelize');
const Category = models.Category;
const Product = models.Product;

const showcaser = require('./../ProductShowcaser.js');
let queryConstructor = showcaser.queryConstructor;
let objectify = showcaser.objectify;

const ShoppingCart = require('../shoppingCart.js');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  next();
});

router.post('/', async (req, res, next) => {
  let includesAlready = req.session.cart
    .map(cartObj => cartObj.cartId)
    .includes(req.body.cartId);
  
  if (!includesAlready) {
    req.session.cart.push(req.body);

    // increment total cart items for view
    res.locals.session.totalNum += 1;
  }
  next();
}); 

router.put('/', async (req, res, next) => {

  let cart = req.session.cart;

  // give session cart object the right quantity
  for (var i = 0, len = req.session.cart.length; i < len; i++) {
    if (cart[i].cartId === req.body.cartId) {
      req.session.cart[i].quantity = req.body.quantity;
    }
  }

  // if session cart object quantity zero, remove object
  req.session.cart = req.session.cart.filter((cartObj) => cartObj.quantity !== '0');

  // recalculate total number of itmes for view
  res.locals.session.totalNum = req.session.cart.reduce((sum, product) => {
    return sum + Number(product.quantity);
  }, 0);

  next();
});

router.delete('/', async (req, res, next) => {
  req.session.cart = [];
  res.locals.session.totalNum = 0;
  next();
});

router.use('/', async (req, res, next) => {

  let cartIds = req.session.cart.map(cartObj => cartObj.cartId);

  //construct cart 'query' with cart IDs 
  let query = {};
  query["include"] = [{model:Category}];
  query["where"] = { id: cartIds};

  // fetch products from database
  let products = await Product.findAll(query)
  products = products.map(product => objectify(product));

  // attach quantities to 'products' array (from session) for view 
  products.forEach((product) => {
    req.session.cart.forEach((cartItem) => {
      if (cartItem.cartId === product.id.toString()) {
        product.quantity = cartItem.quantity;
      }
    })
  })

  // calculate total for veiw
  let total = products.reduce((sum, product) => {
    return sum + product.price*product.quantity;
  }, 0);
  

  res.render('welcome/shopping_cart', {products, total});
});

module.exports = router;


