var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var OrderSchema = new Schema({
	'itemCount' : Number,
	'totalCost' : Number,
	'userId' : Number
});

module.exports = mongoose.model('Order', OrderSchema);
