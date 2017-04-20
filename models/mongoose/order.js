var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    orderedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderedProduct'
      }
    ]
  },
  {
    timestamps: true
  }
);

OrderSchema.post('save', function(doc, next) {
  let shoppingCart = doc.shoppingCart;

  OrderedProduct.create(shoppingCart).then(() => next());
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
