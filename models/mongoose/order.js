var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  charge: Schema.Types.Mixed
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
