'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserAddress = sequelize.define('UserAddress', {
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    AddressId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserAddress;
};