'use strict';
module.exports = (sequelize, DataTypes) => {
  var State = sequelize.define('State', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return State;
};