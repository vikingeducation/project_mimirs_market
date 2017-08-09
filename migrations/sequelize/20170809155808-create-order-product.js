'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('OrderProducts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			orderId: {
				type: Sequelize.INTEGER
			},
			productId: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				defaultValue: Sequelize.fn('NOW'),
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				defaultValue: Sequelize.fn('NOW'),
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('OrderProducts');
	}
};
