var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var models = require("./../models/mongoose");
var Order = mongoose.model("Order");

var seqModels = require("./../models/sequelize");
var sequelize = seqModels.sequelize;
var Product = seqModels.Product;
var Category = seqModels.Category;

const analytics = require("./../helpers/analytics_helper");

router.get("/admin", (req, res) => {
	Order.find()
		.then(orders => {
			res.render("admin/index", { orders });
		})
		.catch(e => res.status(500).send(e.stack));
});

router.get("/order/:id", (req, res) => {
	Order.findById(req.params.id)
		.then(order => {
			console.log("Orders:" + order.orderProducts);
			res.render("admin/show", { order });
		})
		.catch(e => res.status(500).send(e.stack));
});

router.get("/analytics", (req, res) => {
	analytics.getAll().then(data => {
		res.render("admin/analytics", { data });
	});
});

module.exports = router;