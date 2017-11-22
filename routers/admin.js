var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var models = require("./../models/mongoose");
var Order = mongoose.model("Order");

const analytics = require("./../services/analytics");

// index table
router.get("/admin", (req, res) => {
	Order.find()
		.then(orders => {
			console.log("orders", JSON.stringify(orders, 0, 2));
			res.render("admin/index", { orders });
		})
		.catch(e => res.status(500).send(e.stack));
});

//order show
router.get("/order/:id", (req, res) => {
	Order.findById(req.params.id)
		.then(order => {
			res.render("admin/show", { order });
		})
		.catch(e => res.status(500).send(e.stack));
});

router.get("/analytics", (req, res) => {
	analytics.getAll().then(data => {
		console.log("data", JSON.stringify(data, 0, 2));
		res.render("admin/analytics", { data });
	});
});

module.exports = router;
