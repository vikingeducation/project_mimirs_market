'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('UserTypes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
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
		return queryInterface.dropTable('UserTypes');
	}
};
