'use strict';
const faker = require('faker');
module.exports = {
	up: function(queryInterface, Sequelize) {
		const users = [];
		for (let i = 0; i < 20; i++) {
			users.push({
				username: faker.random.words(1),
				password: 'password',
				email: faker.internet.email()
			});
		}
		return queryInterface.bulkInsert('Users', users);
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('Users', null, {}, Sequelize.User);
	}
};
