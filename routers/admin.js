var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var models = require("./../models/mongoose");
var Order = mongoose.model("Order");

// index table
router.get("/admin", (req, res) => {
	Order.find()
		.then(orders => {
			console.log("orders", JSON.stringify(orders, 0, 2));
			res.render("admin/index", { orders });
		})
		.catch(e => res.status(500).send(e.stack));
});

module.exports = router;
