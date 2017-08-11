const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		customer: {
			fname: String,
			lname: String,
			email: String,
			address: {
				street: String,
				city: String,
				state: String
			}
		},
		products: [],
		total: Number,
		token: String,
		card: String
	},
	{
		timestamps: true
	}
);

// Create the model with a defined schema
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
