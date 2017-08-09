var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserTypeSchema = new Schema({
	'name' : String
});

module.exports = mongoose.model('UserType', UserTypeSchema);
