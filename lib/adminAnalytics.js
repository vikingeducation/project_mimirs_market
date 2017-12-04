const mongoModels = require('../models/mongoose');
const { Transaction } = mongoModels;

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

      resolve(analytics);
    })
  })
}

module.exports = AdminAnalytics;
