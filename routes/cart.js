const express = require("express");
const router = express.Router();
const ProductsController = require("./../controllers/products");

router.get("/", ProductsController.showCart);

router.post("/:id/quantity", (req, res) => {
	req.session.cart.forEach(item => {
		if (item.id === req.params.id) {
			item.quantity = req.body.quantity;
		}
	});

	res.redirect("/cart");
});

module.exports = router;
