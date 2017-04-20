var url = require("url");
const express = require("express");
let router = express.Router();
//var modelsSeq = require('./../models/sequelize');
// var Product = modelsSeq.Product;
// var Category = modelsSeq.Category;
// var sequelize = modelsSeq.sequelize;
var mongoose = require("mongoose");
var modelsMon = require("./../models/mongoose");
var Order = mongoose.model("Order");

router.get("/", (req, res) => {
  let totalRevenue = Order.aggregate(
    // Limit to relevant documents and potentially take advantage of an index
    [
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$charge.amount" },
          totalUnitsEver: { $sum: "$totalUnits" }
        }
      }
    ]
  );

  let promiseArr = [totalRevenue];
  Promise.all(promiseArr).then(result => {
    console.log("RESULT", result);
    res.render("analytics/index", {});
  });
});

module.exports = router;
