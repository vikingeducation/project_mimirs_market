const DB_MAP = {
	sequelize: function(model) {
		return {
			findAll: this.db[model].findAll,
			findById: this.db[model].findById
		};
	},
	mongoose: function(model) {
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
		let f = DB_MAP[this.type].bind(this)(model)["findAll"];

		console.log(this.db.User.findAll(query));

		return DB_MAP[this.type].bind(this)(model)["findAll"](query);
	}

	findById(model, id) {
		return DB_MAP[this.type].bind(this)(model)["findById"](id);
	}
}

module.exports = ModelWrapper;
