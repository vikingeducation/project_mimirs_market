const express = require("express");
const router = express.Router();
const mdbModels = require("./../models/mongoose");
const mongoose = require("mongoose");
const Order = mongoose.model("Order");
const OrderItem = mongoose.model("OrderItem");

router.get("/", (req, res) => {
	Order.find({})
		.then(orders => {
			return res.render("dashboard", { orders });
		})
		.catch(e => res.status(500).send(e.stack));
});

router.get("/analytics", (req, res) => {
	let output = {
		total: {},
		products: [],
		states: []
	};

	Order.aggregate({
		$group: {
			_id: null,
			total: { $sum: "$total" },
			count: { $sum: 1 },
			uniqueStates: { $addToSet: "$customer.address.state" }
		}
	})
		.then(total => {
			output.total.total = total[0].total;
			output.total.transactions = total[0].count;
			output.total.states = total[0].uniqueStates.length;
			return OrderItem.aggregate({
				$group: {
					_id: null,
					units: { $sum: "$quantity" },
					uniqueProducts: { $addToSet: "$productId" },
					uniqueCategories: { $addToSet: "$categoryId" }
				}
			});
		})
		.then(total => {
			output.total.units = total[0].units;
			output.total.products = total[0].uniqueProducts.length;
			output.total.categories = total[0].uniqueCategories.length;
			return OrderItem.aggregate([
				{
					$group: {
						_id: "$name",
						total: { $sum: "$total" }
					}
				},
				{ $sort: { total: -1 } },
				{ $limit: 10 }
			]);
		})
		.then(total => {
			output.products = total;
			return Order.aggregate([
				{
					$group: {
						_id: "$customer.address.state",
						total: { $sum: "$total" }
					}
				},
				{ $sort: { total: -1 } },
				{ $limit: 10 }
			]);
		})
		.then(total => {
			output.states = total;
			return OrderItem.aggregate([
				{
					$group: {
						_id: "$category",
						total: { $sum: "$total" }
					}
				},
				{ $sort: { total: -1 } },
				{ $limit: 10 }
			]);
		})
		.then(total => {
			output.categories = total;
			return res.render("analytics", output);
		});
});

router.get("/:id", (req, res) => {
	Order.findById(req.params.id)
		.populate("orderItems")
		.then(order => {
			return res.render("singleOrder", { order });
		})
		.catch(e => res.status(500).send(e.stack));
});

module.exports = router;
