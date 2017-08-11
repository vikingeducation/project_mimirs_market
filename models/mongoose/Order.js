const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    cardType: String,
    stripeToken: String,
    orderItem: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem"
      }
    ],
    fname: String,
    lname: String,
    email: String,
    street: String,
    city: String,
    state: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", OrderSchema);
