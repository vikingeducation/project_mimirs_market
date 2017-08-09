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
          allowNull: false,
          type: Sequelize.STRING
        },
        lname: {
          allowNull: false,
          type: Sequelize.STRING
        },
        email: {
          allowNull: false,
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
        return queryInterface.addIndex("Users", ["email", "id"], {unique:true});
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Users");
  }
};
