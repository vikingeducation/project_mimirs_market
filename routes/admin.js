var express = require('express');
var router = express.Router();
var ctrlAdmin = require('../controller/admin');


// show summary list of orders
router.get('/', ctrlAdmin.orderList);
router.get('/orders', ctrlAdmin.orderList);

module.exports = router;
