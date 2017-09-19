const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
	{
		productId: String,
		name: String,
		sku: String,
		imagePath: String,
		description: String,
		price: Number,
		categoryId: Number,
		category: String,
		quantity: Number,
		total: Number
	},
	{
		timestamps: true
	}
);

// Create the model with a defined schema
const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
