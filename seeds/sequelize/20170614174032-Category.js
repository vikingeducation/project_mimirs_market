'use strict';
var faker = require('faker');
var models = require('./../../models/sequelize');

module.exports = {
  up: function(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      var users = [];
      for (let i = 0; i < 10; i++) {
        users.push({
          fname: `John${ i }`,
          lname: `Doe${ i }`,
          username: `johndoe${ i }`,
          email: `john.doe${ i }@gmail.com`
        });
      }
      return queryInterface.bulkInsert('Users', users);
      */
    var categories = [];
    for (let i = 0; i < 10; i++) {
      categories.push({
        name: faker.commerce.department()
      });
    }

    return queryInterface.bulkInsert('Category', categories);


  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      return queryInterface.bulkDelete('Users', null, {}, models.User);


    */
    return queryInterface.bulkDelete('Category', null, {}, models.Category);
  }
};
