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
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false
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
        return queryInterface.addIndex("Products", ["id", "sku", "name"], {unique:true});
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Products");
  }
};
