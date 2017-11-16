"use strict";

const faker = require("faker");

module.exports = {
	up: (queryInterface, Sequelize) => {
		var products = [];

		console.log("creating products");
		for (var i = 1; i <= 200; i++) {
			var name = faker.commerce.productName();
			var sku = faker.random.uuid();
			var description = faker.random.words(10);
			var price = i;
			var categoryId = i % 15;

			if (categoryId === 0) {
				categoryId = 15;
			}

			products.push({
				name: name,
				sku: sku,
				description: description,
				price: price,
				categoryId: categoryId
			});
		}

		return queryInterface.bulkInsert("Products", products);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Products", null, {}, models.Products);
	}
};
