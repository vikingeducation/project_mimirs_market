var express = require("express");
var router = express.Router();
var Products = require("./../models/sequelize/product");
var Categorys = require("./../models/sequelize/category");
// var sequelize = models.sequelize;

module.exports = app => {
  router.get("/", (req, res) => {
    res.render("search/start");
  });

  return router;
};
