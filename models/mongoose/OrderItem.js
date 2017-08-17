const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
  {
    id: Number,
    name: String,
    price: Number,
    sku: String,
    description: String,
    category: String,
    quantity: Number,
    order: {
      type: Schema.Types.Object,
      ref: "Order"
    }
  },
  {
    timestamps: true
  }
);

var OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
