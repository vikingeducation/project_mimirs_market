var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema = new Schema(
  {
    description: String,
    revenue: Number,
    orderedId: [String],
    orderedQuanity: [Number],
    orderedItems: [
      {
        id: String,
        quanity: Number
      }
    ],
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

// AdminSchema.methods.productsQuantityById = function() {
//   var allIds = [];
//   for (var j = 0; j < this.orderedId.length; j++) {
//     for (var i = 0; i < this.orderedQuanity.length; i++) {
//       allIds.push(this.orderedId[j]);
//     }
//   }
//   return allIds;
// };

var Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
