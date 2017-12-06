var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Product = models.Product;
var Category = models.Category;
var State = models.State;

const mongoose = require("mongoose");
var MongooseModels = require("./../models/mongoose");
var Order = mongoose.model("Order");

var { STRIPE_SK, STRIPE_PK } = process.env;
var stripe = require("stripe")(STRIPE_SK);

// checkout form
router.get("/checkout", (req, res) => {
	var ids = req.session.cart.map(k => k.id);
	var quantities = req.session.cart.map(k => k.quantity);
	var states;
	
	State.findAll()
  .then(results => {
    states = results;

    return Product.findAll({
			include: [{ model: Category }],
			where: { id: { $in: ids } }
		})
		.then(cartProducts => {
			var total = 0;
			for (var i = 0; i < cartProducts.length; i++) {
				total += cartProducts[i].price * quantities[i];
			}

			var result = cartProducts.map(x =>
				Object.assign(x, req.session.cart.find(y => y.id == x.id))
			);

			result.forEach(obj => {
				obj.total = obj.quantity * obj.price;
			});

			res.render("checkout/new", { result, total, states, STRIPE_PK });
		})
		.catch(e => {
			res.status(500).send(e.stack);
		});
	});	
});

// pay submit
router.post("/charges", (req, res) => {
	// get item ids from cart
	var ids = req.session.cart.map(k => k.id);

	// get quantities from cart
	var quantities = req.session.cart.map(k => k.quantity);
	// console.log("req.body: ", JSON.stringify(req.body, 0, 2));

	var total = 0;
	let orderProducts = [];

	Product.findAll({
		include: [{ model: Category }],
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
				orderProducts.push({
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
				email: req.body.email,
				address: req.body.address,
				city: req.body.city,
				state: req.body.state,
				zip: req.body.zip,
				total: req.body.price,
				orderProducts: orderProducts,
				stripe: charge,
				stripeToken: req.body.stripeToken
			});

			return newOrder.save();
			// console.log("charge: ", JSON.stringify(charge, 0, 2));
		})
		.then(order => {
			req.session.cart = [];
			// console.log("order: ", JSON.stringify(order, 0, 2));
			res.render("checkout/show", { order });
		})
		.catch(e => {
			res.status(500).send(e.stack);
		});
});

module.exports = router;