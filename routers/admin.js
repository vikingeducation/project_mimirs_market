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
  router.get("/", async (req, res) => {
    Admin.find({}).then(admin => {
      res.render("admin/start", { admin });
    });
  });

  router.get("/analytics", async (req, res) => {
    var results = {};
    var admin = await Admin.aggregate([
      {
        $group: {
          _id: null,
          totalRev: { $sum: "$revenue" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);
    results.totalRev = admin[0].totalRev;
    results.totalTransactions = admin[0].totalTransactions;
    admin = await Admin.find().distinct("customer.email");
    results.totalCustomers = admin.length;
    results.totalProducts = await Product.count();
    results.totalCategorys = await Category.count();
    admin = await Admin.find().distinct("customer.address.state");
    results.totalStates = admin.length;
    admin = await Admin.find();
    results.totalUnits = 0;
    for (var i = 0; i < admin.length; i++) {
      for (var j = 0; j < admin[i].orderedQuanity.length; j++) {
        results.totalUnits += admin[i].orderedQuanity[j];
      }
    }
    results.states = await Admin.aggregate([
      {
        $group: {
          _id: "$customer.address.state",
          totalRev: { $sum: "$revenue" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);
    admin = await Admin.find();
    prod = await Product.findAll({ include: [Category] });

    var test = [];
    if (admin.length > 1) {
      for (var i = 0; i < admin.length - 1; i++) {
        test = test.concat(admin[i].productsQuantityById());
      }
    }
    admin = test;
    var adminName = admin.map(function(x) {
      return [prod[x - 1].name, prod[x - 1].Category.name, prod[x - 1].price];
    });
    adminName = adminName.sort();
    results.revBy = adminName;
    const count = adminName.reduce((tally, fruit) => {
      tally[fruit] = (tally[fruit] || 0) + 1;
      return tally;
    }, {});
    console.log(count, count[adminName[1]]);
    // console.log("--*****--\n\n" + JSON.stringify(admin) + "\n\n--****--");
    res.render("admin/analytics", { results });
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
