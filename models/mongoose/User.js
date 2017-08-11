const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    fname: String,
    lname: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zip: Number
  },
  {
    timestamps: true
  }
);

let User = mongoose.model("User", UserSchema);
module.exports = User;
