'use strict';
module.exports = function(sequelize, DataTypes) {
	class OrderProduct extends sequelize.Model {
		static associate(models) {}
	}
	OrderProduct.init(
		{
			orderId: DataTypes.INTEGER,
			productId: DataTypes.INTEGER
		},
		{ sequelize }
	);
	return OrderProduct;
};
