const ModelWrapper = require('./model-wrapper');

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
