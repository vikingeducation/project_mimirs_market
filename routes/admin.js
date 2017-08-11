const express = require("express");
const router = express.Router();
const mdbModels = require("./../models/mongoose");
const mongoose = require("mongoose");
const Order = mongoose.model("Order");

router.get("/", (req, res) => {
	Order.find({})
		.then(orders => {
			return res.render("dashboard", { orders });
		})
		.catch(e => res.status(500).send(e.stack));
});

router.get("/:id", (req, res) => {
	Order.findById(req.params.id)
		.then(order => {
			return res.render("singleOrder", { order });
		})
		.catch(e => res.status(500).send(e.stack));
});

module.exports = router;
