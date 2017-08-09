var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var OrderProductSchema = new Schema({
	'orderId' : Number,
	'productId' : Number
});

module.exports = mongoose.model('OrderProduct', OrderProductSchema);
