const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

const mongoose = require("mongoose");
var MongooseModels = require("./../models/mongoose");
var Order = mongoose.model("Order");

const analytics = {};

analytics.getAll = async () => {
	var promiseObj = {};
	return promiseObj;
};

module.exports = analytics;
