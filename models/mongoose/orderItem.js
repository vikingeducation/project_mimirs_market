var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//ORDERS
var OrderItemSchema = new Schema(
  {
    productId: Number,
    name: String,
    price: Number,
    category: String,
    quantity: Number
  },
  {
    timestamps: true
  }
);

// Create the model with a defined schema
var OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
