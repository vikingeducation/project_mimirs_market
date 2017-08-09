'use strict';
module.exports = function(sequelize, DataTypes) {
  var Address = sequelize.define('Address', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    StateId: DataTypes.INTEGER,
    zip: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Address;
};