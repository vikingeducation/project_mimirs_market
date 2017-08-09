'use strict';
const faker = require('faker');
module.exports = {
	up: function(queryInterface, Sequelize) {
		const products = [];
		for (let i = 0; i < 20; i++) {
			products.push({
				name: faker.random.words(3),
				sku: faker.random.number(10),
				desc: faker.lorem.words(25),
				price: faker.finance.amount(3),
				categoryId: i + 1
			});
		}
		return queryInterface.bulkInsert('Products', products);
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('Products', null, {}, Sequelize.Product);
	}
};
