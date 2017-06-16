var models = require('./../models/sequelize');
var sequelize = models.sequelize;
var Product = models.Product;
var Category = models.Category;
var US = require('us');

var mongoose = require('mongoose');
var models = require('./../models/mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('./../config/mongo')[env];
var Transaction = mongoose.model('Transaction');


// import environment variables for stripe
if (process.env.NODE_ENV !== 'production') {
  require('dotenv')
    .config();
}
var {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
var stripe = require('stripe')(STRIPE_SK);

let cartObj = {};

let _createCartList = function(req) {
  let cartItems = [];

  if (req.session.cart != undefined) {
    let cart = req.session.cart;

    // build array of product ID's from the cart to use in query
    cart.forEach(function(item, index, array) {
      cartItems.push(item.id);
      cartObj[item.id] = item.quantity;
    });
  }
  return cartItems;
};

let _itemInCart = function(req) {
  let itemIndex = null;

  if (req.session.cart != undefined) {
    let cart = req.session.cart;
    let itemID = req.params.productID;

    cart.forEach(function(item, index, array) {
      if (item.id === itemID) {
        itemIndex = index;
      }
    });
  }
  return itemIndex;

}


// same code used between both cart index and the checkout page due to common data
let _cartDisplay = function(req, res, next, template) {

  if (req.session.cart != undefined) {
    let criteria = {
      include: [{
        model: Category
      }],
      where: {
        id: {
          $in: _createCartList(req)
        }
      }
    };


    Product.findAll(criteria)
      .then((products) => {
        let total = 0;
        // now insert the quantity ordered into the return result
        products.forEach(function(item, index, array) {
          item.quantityOrdered = cartObj[item.id];
          item.subTotal = (item.quantityOrdered * item.price)
            .toFixed(2);
          total += item.price * item.quantityOrdered;
        });

        res.render(template, {
          title: "Mimir's Market",
          states: US.STATES,
          cart: products,
          cart_count: req.session.cart.length || 0,
          total: total.toFixed(2)
        });

      })
      .catch((e) => res.status(500)
        .send(e.stack));

  }
}

// used to check if item is in cart by other modules
module.exports.cartItemsList = _createCartList;

// display the cart
module.exports.cartIndex = function(req, res, next) {

  _cartDisplay(req, res, next, 'cart/index');

};

// display the checkout page with cart details
module.exports.cartCheckout = function(req, res, next) {

  _cartDisplay(req, res, next, 'cart/checkout');

}

module.exports.cartPayment = function(req, res, next) {

  let customer = {};
  customer.firstName = req.body.firstName;
  customer.lastName = req.body.lastName;
  customer.email = req.body.userEmail;
  customer.streetAddress = req.body.streetAddress;
  customer.cityAddress = req.body.cityAddress;
  customer.stateAddress = req.body.stateAddress;

  req.session.customer = customer;

  res.render('cart/payment', {
    title: "Mimir's Market",
    STRIPE_PK: STRIPE_PK,
    transaction: req.body,
    charge_total: req.body.total * 100,
    cart_count: req.session.cart.length || 0

  });
}

module.exports.captureCharge = function(req, res, next) {
  var charge = req.body;
  stripe.charges.create({
      amount: parseFloat(req.body.total) * 100,
      currency: 'usd',
      description: req.body.transaction,
      source: charge.stripeToken
    })
    .then((charge) => {

      var transaction = new Transaction({
        stripeCharge: charge,
        cartSession: req.session.cart,
        customerSession: req.session.customer
      });
      transaction.save()
        .then((result) => {
          console.log(result);
        })
    })
    .then(() => {
      res.redirect('/cart/delete?_method=delete');
    })
    .catch((e) => res.status(500)
      .send(e.stack));
}

module.exports.cartAdd = function(req, res, next) {
  let cartItem = {
    id: req.params.productID,
    quantity: 1
  };

  if (req.session.cart === undefined) {
    // no cart yet, create one and then add the item
    req.session.cart = [];
    req.session.cart.push(cartItem);
  } else {
    // check cart for existing item and increment quantity if already there

    let idxItem = _itemInCart(req);

    if (idxItem != null) {
      cart[idxItem].quantity++;
    } else {
      req.session.cart.push(cartItem);
    }
  }

  res.redirect(req.headers.referer);
}

module.exports.cartRemove = function(req, res, next) {
  // search cart for item and then delete it
  let cart = req.session.cart;

  if (cart != undefined) {

    let idxItem = _itemInCart(req);

    if (idxItem != null) {
      cart.splice(idxItem, 1);
    }

    req.session.cart = cart;
  };

  res.redirect(req.headers.referer);
}

module.exports.cartUpdateItemQuantity = function(req, res, next) {
  let cart = req.session.cart;
  if (cart != undefined) {

    let idxItem = _itemInCart(req);

    if (idxItem != null) {
      cart[idxItem].quantity = req.body.newQuantity;
      if (cart[idxItem].quantity <= 0) {
        cart.splice(idxItem, 1);
      }
    }

    req.session.cart = cart;
  };

  res.redirect('/cart');
}

module.exports.cartDelete = function(req, res, next) {
  req.session.cart = [];
  res.redirect('/products');
}
