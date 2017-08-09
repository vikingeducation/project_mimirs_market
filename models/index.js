const SequelizeWrapper = require('./sequelize-wrapper');
const MongooseWrapper = require('./mongoose-wrapper');

module.exports = function(type = 'sequelize') {
	const apis = {
		sequelize: SequelizeWrapper,
		mongoose: MongooseWrapper
	};

	return new apis[type](require(`./${type}/index`));
};
