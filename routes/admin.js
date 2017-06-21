var express = require('express');
var router = express.Router();
var ctrlAdmin = require('../controller/admin');


// show summary list of orders
router.get('/', ctrlAdmin.orderList);
router.get('/orders', ctrlAdmin.orderList);

// show individual order details
router.get('/order/:orderID', ctrlAdmin.order);

// show analytics summary page
router.get('/analytics', ctrlAdmin.analytics);

module.exports = router;
