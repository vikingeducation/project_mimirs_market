var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//ORDERS
var OrderSchema = new Schema(
  {
    user: {
      fname: String,
      lname: String,
      email: String,
      street: String,
      city: String,
      state: String
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem"
      }
    ],
    stripe: {
      id: String,
      amount: Number,
      balanceTransaction: String,
      createdAt: Date,
      cardType: String
    }
  },
  {
    timestamps: true
  }
);

// Create the model with a defined schema
var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;

//test commands
/*
let o = new Order({
  user: {fname:'test'},
  items: [],
  stripe: null
})
*/
