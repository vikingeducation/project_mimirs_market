var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CartSchema = new Schema({
  revenue: Number,
  userId: Number,
  products: [[String, Number]]
});


var Cart = mongoose.model('Cart', CartSchema);




module.exports = Cart;
