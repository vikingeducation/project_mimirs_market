"use strict";
const faker = require("faker");
module.exports = {
	up: function(queryInterface, Sequelize) {
		let categories = [
			"abstract",
			"animals",
			"business",
			"cats",
			"city",
			"food",
			"nightlife",
			"fashion",
			"people",
			"nature",
			"sports",
			"technics",
			"transport"
		];

		categories = categories.map(category => {
			return { name: category };
		});

		return queryInterface.bulkInsert("Categories", categories);
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.bulkDelete(
			"Categories",
			null,
			{},
			Sequelize.Category
		);
	}
};
