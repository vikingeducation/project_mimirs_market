const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

const mongoose = require("mongoose");
var MongooseModels = require("./../models/mongoose");
var Order = mongoose.model("Order");

const analytics = {};

analytics.totalTransactions = () => {
	return Order.count();
};

analytics.totalRevenueEver = () => {
	return Order.aggregate([
		{
			$group: {
				_id: null,
				total: { $sum: "$total" }
			}
		}
	]);
};

analytics.totalUniqueStates = () => {
	return Order.distinct("state");
};

analytics.totalUniqueCustomers = () => {
	return Order.distinct("stripe.source.name");
};

analytics.totalCategories = () => {
	return Categories.count();
};

analytics.totalProducts = () => {
	return Products.count();
};

analytics.totalItemsSold = () => {
	return Order.aggregate([
		{ $unwind: "$orderedProducts" },
		{
			$group: {
				_id: null,
				total: { $sum: "$orderedProducts.quantity" }
			}
		}
	]);
};

analytics.revenueByState = () => {
	return Order.aggregate([
		{
			$group: {
				_id: "$state",
				sum: { $sum: "$total" }
			}
		},
		{ $sort: { sum: -1 } }
	]);
};

analytics.revenueByCategory = () => {
	return Order.aggregate([
		{
			$group: {
				_id: "$Category.name",
				revenueForCategory: { $sum: { $multiply: ["$price", "$quantity"] } }
			}
		},
		{ $sort: { revenueForCategory: -1 } },
		{ $limit: 10 }
	]);
};

analytics.revenueByProduct = () => {
	return Order.aggregate([
		{ $unwind: "$orderedProducts" },
		{
			$group: {
				_id: "$orderedProducts.id",
				name: { $first: "$orderedProducts.name" },
				price: { $first: "$orderedProducts.price" },
				quantity: { $sum: "$orderedProducts.quantity" }
			}
		},
		{
			$project: {
				_id: 0,
				name: 1,
				sum: { $multiply: ["$price", "$quantity"] }
			}
		},
		{ $sort: { sum: -1 } },
		{ $limit: 8 }
	]);
};

analytics.getAll = async () => {
	var data = {};
	data.totalTransactions = await analytics.totalTransactions();
	data.totalRevenueEver = (await analytics.totalRevenueEver())[0];
	data.totalUniqueStates = (await analytics.totalUniqueStates()).length;
	data.totalUniqueCustomers = (await analytics.totalUniqueCustomers()).length;
	data.totalCategories = await analytics.totalCategories();
	data.totalProducts = await analytics.totalProducts();
	data.totalItemsSold = (await analytics.totalItemsSold())[0];
	data.revenueByState = await analytics.revenueByState();
	data.revenueByCategory = await analytics.revenueByCategory();
	data.revenueByProduct = await analytics.revenueByProduct();
	return data;
};

module.exports = analytics;
