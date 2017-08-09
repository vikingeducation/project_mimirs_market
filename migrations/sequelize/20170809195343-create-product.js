"use strict";
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface
      .createTable("Products", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        sku: {
          allowNull: false,
          type: Sequelize.STRING
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        price: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        CategoryId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW")
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW")
        }
      })
      .then(() => {
        return queryInterface.addIndex("Products", ["name", "sku"], {
          unique: true
        });
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Products");
  }
};
