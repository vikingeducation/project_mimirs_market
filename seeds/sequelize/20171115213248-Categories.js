"use strict";

const faker = require("faker");

module.exports = {
	up: (queryInterface, Sequelize) => {
		var categories = [];

		console.log("crating categories");
		for (var i = 1; i <= 15; i++) {
			var name = faker.commerce.department();

			categories.push({
				name: name
			});
		}

		return queryInterface.bulkInsert("Categories", categories);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Categories", null, {}, models.Categories);
	}
};
