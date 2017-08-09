const ModelWrapper = require('./model-wrapper');

class MongooseWrapper extends ModelWrapper {
	constructor(db) {
		super(db);
		this.type = ODM_MONGOOSE;
	}
}

module.exports = MongooseWrapper;
