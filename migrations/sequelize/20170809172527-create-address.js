"use strict";
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("Addresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: 'userAddress'
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'userAddress'
      },
      fname: {
        type: Sequelize.STRING
      },
      lname: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      StateId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      zip: {
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
    }).then(() => {
        return queryInterface.addIndex("Addresses", ["id", "name", "UserId"]);
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Addresses");
  }
};
