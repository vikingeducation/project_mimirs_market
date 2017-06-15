var express = require('express');
var router = express.Router();
var ctrlCart = require('../controller/cart');

/* GET home page. */
router.get('/', ctrlCart.cartIndex);

router.put('/add/:productID', ctrlCart.cartAdd);

router.put('/update/:productID', ctrlCart.cartUpdateItemQuantity);

router.delete('/remove/:productID', ctrlCart.cartRemove);

router.delete('/delete', ctrlCart.cartDelete);


module.exports = router;
