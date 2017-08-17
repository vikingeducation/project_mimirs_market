"use strict";
module.exports = function(sequelize, DataTypes) {
  const State = sequelize.define("State", {
    name: DataTypes.STRING
  });
  return State;
};
