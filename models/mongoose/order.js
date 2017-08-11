var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	cart: [
		{
			quantity: Number,
			product: {
				name: String,
				img: String,
				sku: String,
				desc: String,
				price: Number,
				categoryId: Number
			}
		}
	],
	billing: {
		fname: String,
		lname: String,
		email: String,
		address: String,
		city: String,
		state: String
	},
	charge: {
		amount: Number,
		created: Number,
		desc: String,
		refund_url: String
	}
});

module.exports = mongoose.model('Order', OrderSchema);
