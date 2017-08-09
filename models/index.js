class ModelWrapper {
	constructor(db) {
		this.db = db;
	}
}

class SequelizeWrapper extends ModelWrapper {
	findAllUsers(query, options) {
		return this.db.User.findAll(query, options);
	}
}

class MongooseWrapper extends ModelWrapper {
	findAllUsers(query, options) {
		return this.db.User.find(query, options);
	}
}

const apis = {
	sequelize: SequelizeWrapper,
	mongoose: MongooseWrapper
};

module.exports = function(type = 'sequelize') {
	return new apis[type](require(`./${type}/index`));
};
