var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
	{
		fname: String,
		lname: String,
		address: String,
		city: String,
		state: String,
		zip: String,
		total: Number,
		orderedProducts: [],
		stripe: {},
		stripeToken: String
	},
	{
		timestamps: true
	}
);

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
