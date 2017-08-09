'use strict';
module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define('State', {
    name: DataTypes.CHAR,
    abbreviation: DataTypes.CHAR
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return State;
};