const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    cardType: String,
    transactionID: String,
    total: Number,
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem"
      }
    ],
    customer: {
      fname: String,
      lname: String,
      email: String,
      street: String,
      city: String,
      state: String
    }
  },
  {
    timestamps: true
  }
);

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
