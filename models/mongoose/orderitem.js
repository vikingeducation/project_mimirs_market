const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderItemSchema = new Schema(
  [
    {
      name: String,
      price: Number,
      sku: Number,
      description: String,
      category: String,
      quantity: Number
    }
  ],
  {
    timestamps: true
  }
);

var OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
