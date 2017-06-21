var express = require('express');
var router = express.Router();
var ctrlCart = require('../controller/cart');

/* GET home page. */
router.get('/', ctrlCart.cartIndex);

// display checkout page
router.get('/checkout', ctrlCart.cartCheckout);

// make payment
router.post('/payment', ctrlCart.cartPayment);

// callback from stripe 
router.post('/charges', ctrlCart.captureCharge);

// add item to cart
router.put('/add/:productID', ctrlCart.cartAdd);

// update item quantity in cart
router.put('/update/:productID', ctrlCart.cartUpdateItemQuantity);

// delete item from cart
router.delete('/remove/:productID', ctrlCart.cartRemove);

// empty entire cart
router.delete('/delete', ctrlCart.cartDelete);


module.exports = router;
