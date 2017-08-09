'use strict';
module.exports = function(sequelize, DataTypes) {
	class Product extends sequelize.Model {
		static associate(models) {}
	}
	Product.init(
		{
			name: DataTypes.STRING,
			img: DataTypes.BLOB,
			sku: DataTypes.STRING,
			desc: DataTypes.TEXT,
			price: DataTypes.REAL,
			categoryId: DataTypes.INTEGER
		},
		{ sequelize }
	);
	return Product;
};
