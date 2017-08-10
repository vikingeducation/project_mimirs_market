const express = require("express");
const router = express.Router();
const ProductsController = require("./../controllers/products");

router.get("/", (req, res) => {
	res.redirect("/");
});

router.get("/:id", ProductsController.singleProduct);

router.post("/:id", (req, res) => {
	req.session.cart = req.session.cart || [];
	req.session.cart.push({ id: req.params.id, quantity: 1 });
	res.redirect("back");
});

module.exports = router;
