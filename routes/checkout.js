const express = require("express");
const router = express.Router();
const ProductsController = require("./../controllers/products");

router.get("/", (req, res) => {
	ProductsController.showCart(req, res).then(products => {
		res.render("checkout", { products: products[0], sum: products[1] });
	});
});

module.exports = router;
