var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var models = require("./../models/mongoose");
var Order = mongoose.model("Order");

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


module.exports = router;