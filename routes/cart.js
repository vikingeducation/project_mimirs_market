const express = require("express");
const router = express.Router();
const ProductsController = require("./../controllers/products");

router.get("/", (req, res) => {
	ProductsController.showCart(req, res).then(cart => {
		res.render("cart", { products: cart.products, sum: cart.sum });
	});
});

router.post("/:id/quantity", (req, res) => {
	if (isNaN(Number(req.body.quantity))) {
		res.redirect("back");
	}

	if (Number(req.body.quantity) <= 0) {
		removeSingle(req, res);
	}

	req.session.cart.forEach(item => {
		if (item.id === req.params.id) {
			item.quantity = req.body.quantity;
		}
	});

	res.redirect("back");
});

router.post("/:id/remove", removeSingle);

router.post("/empty", (req, res) => {
	req.session.cart = [];
	res.redirect("back");
});

function removeSingle(req, res) {
	req.session.cart = req.session.cart.filter(el => {
		return el.id !== req.params.id;
	});

	res.redirect("back");
}

module.exports = router;
