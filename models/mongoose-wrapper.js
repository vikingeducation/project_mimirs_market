const ModelWrapper = require('./model-wrapper');
const MODEL_USER = 'User';
const MODEL_PRODUCT = 'Product';
const MODEL_ORDER = 'Order';

const ODM_MONGOOSE = 'mongoose';

class MongooseWrapper extends ModelWrapper {
	constructor(db) {
		super(db);
		this.type = ODM_MONGOOSE;
	}

	saveOrder(order) {
		return this.create(MODEL_ORDER, order);
	}
}

module.exports = MongooseWrapper;
