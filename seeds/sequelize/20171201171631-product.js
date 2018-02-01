const models = require('../../models/sequelize');
const { Category, Product } = models;
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await Category.findAll();

    let products = [];

    for (let category of categories) {
      for (let i = 0; i < 5; i++) {
        products.push({
          name: faker.commerce.productName(),
          sku: faker.random.uuid(),
          description: faker.lorem.paragraph(),
          price: parseFloat(faker.commerce.price()).toFixed(2),
          img: 'https://picsum.photos/640/480/?image',
          categoryId: category.id
        });
      }
    }

    return queryInterface.bulkInsert('Products', products);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {}, Product);
  }
};
