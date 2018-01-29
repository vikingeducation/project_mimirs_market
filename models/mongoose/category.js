var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: String
});

let Category = mongoose.model('Category', CategorySchema);

module.exports = Category

