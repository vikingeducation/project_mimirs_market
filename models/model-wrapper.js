const DB_MAP = {
	sequelize: {
		findAll: 'findAll',
		findById: 'findById'
	},
	mongoose: {
		findAll: 'find',
		findById: 'findById'
	}
};

class ModelWrapper {
	constructor(db) {
		this.db = db;
	}

	findAll(model, query, options) {
		return this.db[model][DB_MAP[this.type]['findAll']](query);
	}

	findById(model, id, options) {
		return this.db[model][DB_MAP[this.type]['findById']](id, options);
	}
}

module.exports = ModelWrapper;
