const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');
const OrderController = require('../controllers/OrderController');

router.post('/products/refine', ProductController.refine);
router.get('/products/paginate/:page', ProductController.paginate);
router.patch('/cart/:productId/:quantity', CartController.update);
router.post('/orders/billing', OrderController.saveBilling);

module.exports = router;
