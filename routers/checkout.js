var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

var { STRIPE_SK, STRIPE_PK } = process.env;
var stripe = require("stripe")(STRIPE_SK);

// checkout form
router.get("/checkout", (req, res) => {
	// get item ids from cart
	var ids = req.session.cart.map(k => k.id);

	// get quantities from cart
	var quantities = req.session.cart.map(k => k.quantity);

	Products.findAll({
		include: [{ model: Categories }],
		where: { id: { $in: ids } }
	})
		.then(cartProducts => {
			var total = 0;
			for (var i = 0; i < cartProducts.length; i++) {
				total += cartProducts[i].price * quantities[i];
			}

			// assign quantities
			// https://stackoverflow.com/questions/35903850/combine-json-arrays-by-key-javascript
			var result = cartProducts.map(x =>
				Object.assign(x, req.session.cart.find(y => y.id == x.id))
			);

			result.forEach(obj => {
				obj.total = obj.quantity * obj.price;
			});

			res.render("checkout/new", { result, total, STRIPE_PK });
			// console.log("result: ", JSON.stringify(result, 0, 2));
		})
		.catch(e => {
			res.status(500).send(e.stack);
		});
});

// pay submit
router.post("/pay", (req, res) => {
	console.log("req.body: ", JSON.stringify(req.body, 0, 2));
	res.send("we got ur money");
});

module.exports = router;
