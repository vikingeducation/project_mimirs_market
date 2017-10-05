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
      if (admin.length === 0) {
        res.redirect("back");
      } else {
        res.render("admin/start", { admin });
      }
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
    if (admin.length === 0) {
      res.redirect("back");
    } else {
      results.totalRev = admin[0].totalRev;
      results.totalTransactions = admin[0].totalTransactions;
      admin = await Admin.find().distinct("customer.email");
      results.totalCustomers = admin.length;
      results.totalProducts = await Product.count();
      results.totalCategorys = await Category.count();
      admin = await Admin.find().distinct("customer.address.state");
      results.totalStates = admin.length;
      adminAll = await Admin.find();
      results.totalUnits = 0;
      for (var i = 0; i < adminAll.length; i++) {
        for (var j = 0; j < adminAll[i].orderedQuanity.length; j++) {
          results.totalUnits += adminAll[i].orderedQuanity[j];
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

      //revenue by Products
      //[{id:5 quanity:4},{id:1 quanity:1}] => [5,5,5,5,1]
      var ordersById = [];
      for (var i = 0; i < adminAll.length; i++) {
        for (var j = 0; j < adminAll[i].orderedItems.length; j++) {
          for (var n = 0; n < adminAll[i].orderedItems[j].quanity; n++) {
            ordersById.push(adminAll[i].orderedItems[j].id);
          }
        }
      }
      //all products
      prodAll = await Product.findAll({
        include: [Category],
        order: ["id"]
      });
      //[5,5,5,5,1] => [{name: category: price:}, {},{},{}]
      var orderedItems = [];
      for (var i = 0; i < ordersById.length; i++) {
        orderedItems.push({
          name: prodAll[ordersById[i] - 1].name,
          category: prodAll[ordersById[i] - 1].Category.name,
          price: prodAll[ordersById[i] - 1].price
        });
      }
      console.log(orderedItems);
      //[{name: category: price:}, {},{},{}] => [{name:'unique' price:'added together' }]
      var itemsGrouped = [];
      for (var i = 0; i < orderedItems.length; i++) {
        var bool = false;
        for (var j = 0; j < itemsGrouped.length; j++) {
          if (itemsGrouped[j].name === orderedItems[i].name) {
            itemsGrouped[j].price += orderedItems[i].price;
            bool = true;
          }
        }
        if (!bool) {
          itemsGrouped.push({
            name: orderedItems[i].name,
            price: orderedItems[i].price
          });
        }
      }
      results.revByProduct = itemsGrouped;
      //[{name: category: price:}, {},{},{}] => [{category:'unique' price:'added together' }]
      var categoryGrouped = [];
      for (var i = 0; i < orderedItems.length; i++) {
        var bool = false;
        for (var j = 0; j < categoryGrouped.length; j++) {
          if (categoryGrouped[j].category === orderedItems[i].category) {
            categoryGrouped[j].price += orderedItems[i].price;
            bool = true;
          }
        }
        if (!bool) {
          categoryGrouped.push({
            category: orderedItems[i].category,
            price: orderedItems[i].price
          });
        }
      }
      results.revByCategory = categoryGrouped;
      res.render("admin/analytics", { results });
    }
  });

  router.get("/:id", async (req, res) => {
    var admin = await Admin.findById(req.params.id);
    var products = await Product.findAll({
      include: [Category],
      order: ["id"]
    });
    var orderedItemsList = [];
    for (var i = 0; i < admin.orderedItems.length; i++) {
      orderedItemsList.push({
        name: products[admin.orderedItems[i].id - 1].name,
        price: products[admin.orderedItems[i].id - 1].price,
        sku: products[admin.orderedItems[i].id - 1].sku,
        description: products[admin.orderedItems[i].id - 1].description,
        category: products[admin.orderedItems[i].id - 1].Category.name,
        quanity: admin.orderedItems[i].quanity
      });
    }
    res.render("admin/single", { admin, orderedItemsList });
  });

  return router;
};
