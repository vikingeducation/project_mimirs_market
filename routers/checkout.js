var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

const mongoose = require("mongoose");
var MongooseModels = require("./../models/mongoose");
var Order = mongoose.model("Order");

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
	// get item ids from cart
	var ids = req.session.cart.map(k => k.id);

	// get quantities from cart
	var quantities = req.session.cart.map(k => k.quantity);
	// console.log("req.body: ", JSON.stringify(req.body, 0, 2));

	var total = 0;
	let orderedProducts = [];

	Products.findAll({
		include: [{ model: Categories }],
		where: { id: { $in: ids } }
	})
		.then(cartProducts => {
			//get a total
			for (var i = 0; i < cartProducts.length; i++) {
				total += cartProducts[i].price * quantities[i];
			}

			//assign quantities
			// https://stackoverflow.com/questions/35903850/combine-json-arrays-by-key-javascript
			var result = cartProducts.map(x =>
				Object.assign(x, req.session.cart.find(y => y.id == x.id))
			);

			// console.log("cartProducts: ", JSON.stringify(cartProducts, 0, 2));
			// build order object
			cartProducts.forEach(product => {
				orderedProducts.push({
					id: product.id,
					name: product.name,
					sku: product.sku,
					description: product.description,
					price: product.price,
					category: product.Category.name,
					quantity: product.quantity
				});
			});

			return stripe.charges.create({
				amount: req.body.price * 100,
				currency: "usd",
				description: req.body.description,
				source: req.body.stripeToken
			});
		})
		.then(charge => {
			var newOrder = new Order({
				fname: req.body.fname,
				lname: req.body.lname,
				address: req.body.address,
				city: req.body.city,
				state: req.body.state,
				zip: req.body.zip,
				total: req.body.price,
				orderedProducts: orderedProducts,
				stripe: charge,
				stripeToken: req.body.stripeToken
			});

			return newOrder.save();
			// console.log("charge: ", JSON.stringify(charge, 0, 2));
		})
		.then(order => {
			req.session.cart = [];
			console.log("order: ", JSON.stringify(order, 0, 2));
			res.render("checkout/show", { order });
		})
		.catch(e => {
			res.status(500).send(e.stack);
		});
});

module.exports = router;
