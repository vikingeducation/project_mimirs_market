const router = require('express').Router();
const ProductController = require('../controllers/ProductController');

router.post('/products/refine', ProductController.refine);
router.get('/products/paginate/:page', ProductController.paginate);

module.exports = router;
