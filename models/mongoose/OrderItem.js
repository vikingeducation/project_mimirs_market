const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItem = new Schema({
  name: String,
  price: Number,
  sku: String,
  description: String,
  category: String,
  quantity: number,
  order: {
    type: Schema.Types.Object
    ref: "Order"
  }
});
