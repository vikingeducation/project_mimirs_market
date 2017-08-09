'use strict';
module.exports = function(sequelize, DataTypes) {
	class User extends sequelize.Model {
		static associate(models) {}
	}
	User.init(
		{
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			email: DataTypes.STRING,
			userTypeId: DataTypes.INTEGER
		},
		{ sequelize }
	);
	return User;
};
