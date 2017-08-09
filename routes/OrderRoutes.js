var express = require('express');
var router = express.Router();
var OrderController = require('../controllers/OrderController.js');

/*
 * GET
 */
router.get('/', OrderController.list);

/*
 * GET
 */
router.get('/:id', OrderController.show);

/*
 * POST
 */
router.post('/', OrderController.create);

/*
 * PUT
 */
router.put('/:id', OrderController.update);

/*
 * DELETE
 */
router.delete('/:id', OrderController.remove);

module.exports = router;
