'use strict';
const faker = require('faker');
module.exports = {
	up: function(queryInterface, Sequelize) {
		const categories = [];
		for (let i = 0; i < 20; i++) {
			categories.push({
				name: faker.commerce.department()
			});
		}
		return queryInterface.bulkInsert('Categories', categories);
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.bulkDelete(
			'Categories',
			null,
			{},
			Sequelize.Category
		);
	}
};
