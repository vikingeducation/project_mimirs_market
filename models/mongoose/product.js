var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProductSchema = new Schema({
	'name' : String,
	'sku' : String,
	'desc' : String,
	'price' : Number,
	'categoryId' : Number
});

module.exports = mongoose.model('Product', ProductSchema);
