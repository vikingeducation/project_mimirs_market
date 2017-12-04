const mongoModels = require('../models/mongoose');
const { Transaction } = mongoModels;
const sequelizeModels = require('../models/sequelize');
const { Product, Category } = sequelizeModels;

const AdminAnalytics = {};

AdminAnalytics.get = () => {
  const analytics = {};

  return new Promise((resolve, reject) => {
    // get total revenue
    return Transaction.aggregate([{
      $group: {
        _id: null,
        total: {
          $sum: "$amount"
        }
      }
    }])

    .then(results => {
      analytics.totalRevenue = results[0].total;

      // get total units sold
      return Transaction.aggregate([{
        $group: {
          _id: null,
          total: {
            $sum: "$totalUnits"
          }
        }
      }]);
    })

    .then(results => {
      analytics.totalUnits = results[0].total;

      // get total transactions
      return Transaction.find();
    })

    .then(transactions => {
      analytics.totalTransactions = transactions.length;

      // get revenue by product and category
      const productRevenue = {};
      const categoryRevenue = {};

      for (let order of transactions) {
        let products = order._doc.products;

        for (let id of Object.keys(products)) {

          if (productRevenue[products[id].name]) {
            productRevenue[products[id].name].revenue += products[id].revenue;
          } else {
            productRevenue[products[id].name] = { revenue: products[id].revenue };
          }

          if (categoryRevenue[products[id].category]) {
            categoryRevenue[products[id].category].revenue += products[id].revenue;
          } else {
            categoryRevenue[products[id].category] = { revenue: products[id].revenue };
          }
        }
      }

      analytics.productRevenue = productRevenue;
      analytics.categoryRevenue = categoryRevenue;

      // get product count
      return Product.count();
    })

    .then(result => {
      analytics.totalProducts = result;

      // get total categories
      return Category.count();
    })

    .then(result => {
      analytics.totalCategories = result;

      return Transaction.aggregate([{
        $group: {
          _id: "$state",
          total: {
            $sum: "$amount"
          }
        }
      }])
    })

    .then(results => {
      analytics.stateRevenues = results;

      resolve(analytics);
    })
  })
}

module.exports = AdminAnalytics;
