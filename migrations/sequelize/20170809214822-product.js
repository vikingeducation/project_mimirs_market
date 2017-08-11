"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'alter table "Products" alter column img SET data type varchar(255);'
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Products");
  }
};
