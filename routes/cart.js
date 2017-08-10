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

router.post("/:id/remove", (req, res) => {
	req.session.cart = req.session.cart.filter(el => {
		return el.id !== req.params.id;
	});

	res.redirect("/cart");
});

module.exports = router;
