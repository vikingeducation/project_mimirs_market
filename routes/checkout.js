const express = require("express");
const router = express.Router();
const ProductsController = require("./../controllers/products");
const stripe = require("stripe")(process.env.STRIPE_SK);
const mongoose = require("mongoose");
const mdbModels = require("./../models/mongoose");

router.get("/", (req, res) => {
	output = {};
	ProductsController.showCart(req, res)
		.then(cart => {
			output.products = cart.products;
			output.sum = cart.sum;
			output.STRIPE_PK = process.env.STRIPE_PK;

			return ProductsController.findStates();
		})
		.then(states => {
			output.states = states;
			res.render("checkout", output);
		});
});

router.post("/charge", (req, res) => {
	let charge = req.body;
	let order = {};
	let orderItems = [];
	order.customer = {
		fname: req.body.fname,
		lname: req.body.lname,
		email: req.body.email,
		address: {
			street: req.body.street,
			city: req.body.city,
			state: req.body.state
		}
	};

	order.orderItems = [];

	ProductsController.showCart(req, res)
		.then(cart => {
			order.description = `Bought ${Object.keys(cart.products).length} item(s)`;
			cart.products.forEach(product => {
				product = new mdbModels.OrderItem({
					id: product.id,
					name: product.name,
					sku: product.sku,
					imagePath: product.imagePath,
					description: product.description,
					price: product.price,
					categoryId: product.categoryId,
					category: product.Category.name,
					createdAt: product.createdAt,
					updatedAt: product.updatedAt,
					quantity: product.quantity,
					total: product.price * product.quantity
				});

				order.orderItems.push(product);
				orderItems.push(product);
			});
			order.total = cart.sum;

			return stripe.charges.create({
				amount: cart.sum * 100,
				currency: "usd",
				description: `Bought ${Object.keys(cart.products).length} item(s)`,
				source: charge.stripeToken
			});
		})
		.then(newCharge => {
			console.log(newCharge);
			(order.token = newCharge.balance_transaction), (order.card =
				newCharge.source.brand);

			newOrder = new mdbModels.Order(order);

			let promises = [];

			promises.push(newOrder.save());

			orderItems.forEach(model => {
				promises.push(model.save());
			});

			return Promise.all(promises);
		})
		.then(() => {
			req.session.cart = [];
			res.redirect("/");
		})
		.catch(e => res.status(500).send(e.stack));
});

module.exports = router;
