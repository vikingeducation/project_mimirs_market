"use strict";
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface
      .createTable("Users", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        fname: {
          type: Sequelize.STRING
        },
        lname: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING
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
        return queryInterface.addIndex("Users", ["email", "id"]);
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Users");
  }
};
