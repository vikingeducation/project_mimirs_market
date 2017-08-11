'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Orders', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			itemCount: {
				type: Sequelize.INTEGER
			},
			totalCost: {
				type: Sequelize.REAL
			},
			userId: {
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
		return queryInterface.dropTable('Orders');
	}
};
