'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			username: {
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			userTypeId: {
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
		return queryInterface.dropTable('Users');
	}
};
