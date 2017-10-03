var express = require("express");
var router = express.Router();
//sequelize
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;
//mongoose
const mongoose = require("mongoose");
var modelsM = require("./../models/mongoose");
var Admin = mongoose.model("Admin");

module.exports = app => {
  router.get("/", (req, res) => {
    Admin.find({}).then(admin => {
      res.render("admin/start", { admin });
    });
  });

  router.get("/:id", (req, res) => {
    Admin.findById(req.params.id).then(admin => {
      Product.findAll({
        where: {
          id: admin.orderedId
        },
        include: [Category]
      }).then(products => {
        res.render("admin/single", { admin, products });
      });
    });
  });
  return router;
};
