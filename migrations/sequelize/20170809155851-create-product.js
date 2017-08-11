'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Products', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			img: {
				type: Sequelize.BLOB
			},
			sku: {
				type: Sequelize.STRING
			},
			desc: {
				type: Sequelize.TEXT
			},
			price: {
				type: Sequelize.REAL
			},
			categoryId: {
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
		return queryInterface.dropTable('Products');
	}
};
