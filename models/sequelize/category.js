'use strict';
module.exports = function(sequelize, DataTypes) {
	class Category extends sequelize.Model {
		static associate(models) {}
	}

	Category.init(
		{
			name: DataTypes.STRING
		},
		{ sequelize }
	);

	return Category;
};
