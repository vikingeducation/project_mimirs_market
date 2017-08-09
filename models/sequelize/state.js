"use strict";
module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define("State", {
    name: DataTypes.STRING
  });
  return State;
};
