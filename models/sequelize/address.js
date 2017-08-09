"use strict";

module.exports = function(sequelize, DataTypes) {
  var Address = sequelize.define("Address", {
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    StateId: DataTypes.INTEGER,
    zip: DataTypes.INTEGER
  });

  Address.associate = function(models) {
    Address.belongsTo(models.User);
    Address.belongsTo(models.State);
  }



  return Address;
};
