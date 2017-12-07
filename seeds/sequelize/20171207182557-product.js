'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let stats = {
      1: 'single',
      2: 'dating',
      3: 'married',
      4: 'divorced',
      5: 'complicated'
    };
    let numberMaker = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    let statusMaker = (obj, max) => {
      let num = numberMaker(1, max);
      return obj[num];
    };
    var profiles = [];
    for (let i = 0; i < 10; i++) {
      profiles.push({
        name: faker.commerce.productName(),
        sku: faker.random.number(),
        description: faker.random.words(),
        price: faker.commerce.price()
      });
    }
    return queryInterface.bulkInsert('Profiles', profiles);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
