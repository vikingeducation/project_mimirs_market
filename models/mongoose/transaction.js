var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a new schema for
// the user model
var TransactionSchema = new Schema({
  stripeCharge: Object,
  cartSession: Object,
  customerSession: Object
}, {
  timestamps: true
});

// Create the model with a defined schema
var Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
