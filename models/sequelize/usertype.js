'use strict';
module.exports = function(sequelize, DataTypes) {
	class UserType extends sequelize.Model {
		static associate(models) {}
	}
	UserType.init(
		{
			name: DataTypes.STRING
		},
		{ sequelize }
	);
	return UserType;
};
