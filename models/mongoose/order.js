var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
	{
		fname: String,
		lname: String,
		email: String,
		address: String,
		city: String,
		state: String,
		zip: String,
		total: Number,
		orderProducts: [],
		stripe: {},
		stripeToken: String
	},
	{
		timestamps: true
	}
);

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;