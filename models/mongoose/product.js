var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let ProductSchema = new Schema({
  name: String,
  categoryId: String,
  price: Number,
  stock: Number,
  description: String
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = Product
