var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderItemSchema = new Schema({
  productId: Number,
  productname: String,
  productSku: Number,
  category: String,
  quantity: Number,
  price: Number
});

var OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
