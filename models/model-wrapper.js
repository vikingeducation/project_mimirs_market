const DB_MAP = {
	sequelize: {
		count: 'count',
		findAll: 'findAll',
		findById: 'findById',
		findAndCountAll: 'findAndCountAll'
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

	_getMethod(name) {
		return DB_MAP[this.type][name];
	}

	getCount(model, query) {
		let method = this._getMethod('count');
		return this.db[model][method](query);
	}

	findAll(model, query) {
		let method = this._getMethod('findAll');
		return this.db[model][method](query);
	}

	findById(model, id, options) {
		let method = this._getMethod('findById');
		return this.db[model][method](id, options);
	}

	findAndCountAll(model, query) {
		let method = this._getMethod('findAndCountAll');
		return this.db[model][method](query);
	}
}

module.exports = ModelWrapper;
