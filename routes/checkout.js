const express = require("express");
const router = express.Router();
const ProductsController = require("./../controllers/products");
const stripe = require("stripe")(process.env.STRIPE_SK);
const mongoose = require("mongoose");
const mdbModels = require("./../models/mongoose");

router.get("/", (req, res) => {
	ProductsController.showCart(req, res).then(cart => {
		res.render("checkout", {
			products: cart.products,
			sum: cart.sum,
			STRIPE_PK: process.env.STRIPE_PK
		});
	});
});

router.post("/charge", (req, res) => {
	let charge = req.body;
	let order = {};
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

	ProductsController.showCart(req, res)
		.then(cart => {
			order.products = cart.products.map(product => {
				return {
					id: product.id,
					name: product.name,
					sku: product.sku,
					imagePath: product.imagePath,
					description: product.description,
					price: product.price,
					categoryId: product.categoryId,
					createdAt: product.createdAt,
					updatedAt: product.updatedAt
				};
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
			(order.token = charge.stripeToken), (order.card = newCharge.source.brand);

			new mdbModels.Order(order).save();
			// ... Save charge and session data
			// from checkout and cart
			// to MongoDB
		})
		.then(() => {
			req.session.cart = [];
			res.redirect("/");
		})
		.catch(e => res.status(500).send(e.stack));
});

module.exports = router;
