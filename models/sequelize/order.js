'use strict';
module.exports = function(sequelize, DataTypes) {
	class Order extends sequelize.Model {
		static associate(models) {}
	}
	Order.init(
		{
			itemCount: DataTypes.INTEGER,
			totalCost: DataTypes.REAL,
			userId: DataTypes.INTEGER
		},
		{ sequelize }
	);
	return Order;
};
