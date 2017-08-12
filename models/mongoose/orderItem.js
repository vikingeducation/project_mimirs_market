var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderItemSchema = new Schema({
  productId: Number,
  name: String,
  sku: String,
  category: String,
  quantity: Number,
  price: Number,
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order"
  }
});

OrderItemSchema.virtual('updateOrder').set(function(order) {
  return this.order = order;
})

var OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
