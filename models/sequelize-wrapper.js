const ModelWrapper = require('./model-wrapper');
const MODEL_USER = 'User';
const MODEL_PRODUCT = 'Product';
const MODEL_ORDER = 'Order';

const ORM_SEQUELIZE = 'sequelize';

class SequelizeWrapper extends ModelWrapper {
	constructor(db) {
		super(db);
		this.type = ORM_SEQUELIZE;
	}

	/******************************
	 * USERS
	 */
	findAllUsers(options) {
		return this.findAll(MODEL_USER, options);
	}

	findUserById(id) {
		return this.findById(MODEL_USER, id);
	}

	/******************************
	 * PRODUCTS
	 */
	findAllProducts(options) {
		return this.findAll(MODEL_PRODUCT, options);
	}

	findProductById(id) {
		return this.findById(MODEL_PRODUCT, id);
	}
}

module.exports = SequelizeWrapper;
