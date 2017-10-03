var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema = new Schema(
  {
    description: String,
    revenue: Number,
    orderedId: [String],
    orderedQuanity: [Number],
    customer: {
      fname: String,
      lname: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String
      }
    },
    order: {
      checkoutDate: Date,
      stripeToken: String,
      cardType: String,
      email: String
    }
  },
  {
    timestamps: true
  }
);

var Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
