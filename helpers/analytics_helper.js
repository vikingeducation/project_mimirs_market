const mongoose = require("mongoose");
var models = require("./../models/mongoose");
var Order = mongoose.model("Order");

var seqModels = require("./../models/sequelize");
var sequelize = seqModels.sequelize;
var Product = seqModels.Product;
var Category = seqModels.Category;


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
	return Category.count();
};

analytics.totalProducts = () => {
	return Product.count();
};

analytics.totalItemsSold = () => {
	return Order.aggregate([
		{ $unwind: "$orderProducts" },
		{
			$group: {
				_id: null,
				total: { $sum: "$orderProducts.quantity" }
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
		{ $unwind: "$orderProducts" },
		{
			$group: {
				_id: "$orderProducts.category",
				sum: { $sum: "$total" }
			}
		},
		{ $sort: { sum: -1 } }
	]);
};

analytics.revenueByProduct = () => {
	return Order.aggregate([
		{ $unwind: "$orderProducts" },
		{
			$group: {
				_id: "$orderProducts.id",
				name: { $first: "$orderProducts.name" },
				sum: { $sum: "$total" }
				// price: { $first: parseInt("$orderProducts.price") },
				// quantity: { $sum: parseInt("$orderProducts.quantity") }
			}
		},
		// {
		// 	$project: {
		// 		_id: 0,
		// 		name: 1,
		// 		sum: { $multiply: ["$price", "$quantity"] }
		// 	}
		// },
		{ $sort: { sum: -1 } }
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