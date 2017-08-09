const MODEL_USER = 'User';
const MODEL_PRODUCT = 'Product';
const MODEL_ORDER = 'Order';

const ORM_SEQUELIZE = 'sequelize';
const ODM_MONGOOSE = 'mongoose';

const DB_MAP = {
	ORM_SEQUELIZE: function(model) {
		return {
			findAll: this.db[model].findAll,
			findById: this.db[model].findById
		};
	},
	ODM_MONGOOSE: function(model) {
		return {
			findAll: this.db[model].find,
			findById: this.db[model].findById
		};
	}
};

class ModelWrapper {
	constructor(db) {
		this.db = db;
	}

	findAll(model, query, options) {
		return DB_MAP[this.type](model)['findAll'](query, options);
	}

	findById(model, id) {
		return DB_MAP[this.type](model)['findById'](id);
	}
}

module.exports = ModelWrapper;
