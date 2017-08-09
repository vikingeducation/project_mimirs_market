const ModelWrapper = require("./model-wrapper");
const MODEL_USER = "User";
const MODEL_PRODUCT = "Product";
const MODEL_ORDER = "Order";

const ORM_SEQUELIZE = "sequelize";

class SequelizeWrapper extends ModelWrapper {
	constructor(db) {
		super(db);
		this.type = ORM_SEQUELIZE;
	}

	findAllUsers(query, options) {
		return this.findAll(MODEL_USER, query, options);
	}

	findUserById(id) {
		return this.findById(MODEL_USER, id);
	}
}

module.exports = SequelizeWrapper;
