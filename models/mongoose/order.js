var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var OrderedProduct = mongoose.model("OrderedProduct");

var OrderSchema = new Schema(
  {
    charge: Schema.Types.Mixed,
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    shoppingCart: Array,
    description: String,
    stripeToken: String,
    stripeTokenType: String,
    totalUnits: Number,
    total: Number,
    orderedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderedProduct"
      }
    ]
  },
  {
    timestamps: true
  }
);

OrderSchema.post("save", function(doc, next) {
  let shoppingCart = doc.shoppingCart;
  // console.log(Order.find({}));

  OrderedProduct.create(shoppingCart).then(() => next());
});

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
