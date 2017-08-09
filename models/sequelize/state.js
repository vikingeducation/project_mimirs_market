"use strict";
module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define("State", {
    name: DataTypes.STRING
  });

  State.associate = function(models) {
    State.hasMany(models.Address);
  }

  return State;
};
