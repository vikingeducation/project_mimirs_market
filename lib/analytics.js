const sqlModels = require("./../models/sequelize");
const sequelize = sqlModels.sequelize;

const { Product, Category } = sqlModels;

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");

const Order = mongoose.model("Order");


let analytics = {};

analytics.overview = () => {
  return Order.aggregate([
    { $group:
      {
        _id: null,
        revenue: { $sum: "$revenue" },
        quantity: { $sum: "$quantity" },
        transactions: { $sum: 1 }
      }
    },
    { $project: { _id: 0 } }
  ]);
};

analytics.uniqueEmails = () => {
  return Order.distinct('email');
};

analytics.productCount = () => {
  return Product.count();
};

analytics.categoryCount = () => {
  return Category.count();
};

analytics.uniqueStates = () => {
  return Order.distinct('state');
};

analytics.revenueByProduct = () => {
  return Order.aggregate([
    { $unwind: '$products' },
    { $group:
      {
        _id: '$products.id',
        name: { $first: '$products.name' },
        price: { $first: '$products.price' },
        quantity: { $sum: '$products.quantity' }
      }
    },
    { $project:
      {
        _id: 0,
        name: 1,
        revenue: { '$multiply': [ '$price', '$quantity' ] }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
};

analytics.revenueByState = () => {
  return Order.aggregate([
    { $group:
      {
        _id: '$state',
        name: { $first: '$state' },
        revenue: { $sum: '$revenue' }
      }
    },
    { $project: { _id: 0 } },
    { $sort: { revenue: -1 } }
  ]);
};

analytics.revenueByCategory = () => {
  return Order.aggregate([
    { $unwind: '$products' },
    { $group:
      {
        _id: '$products.id',
        category: { $first: '$products.category' },
        price: { $first: '$products.price' },
        quantity: { $sum: '$products.quantity' }
      }
    },
    { $project:
      {
        _id: 0,
        category: 1,
        productRevenue: { '$multiply': [ '$price', '$quantity' ] }
      }
    },
    { $group:
      {
        _id: '$category',
        name: { $first: '$category' },
        revenue: { $sum: '$productRevenue' }
      }
    },
    { $project: { _id: 0 } },
    { $sort: { revenue: -1 } }
  ]);
};

analytics.getAll = async () => {
  let results = {};
  results.overview = (await analytics.overview())[0];
  results.customerCount = (await analytics.uniqueEmails()).length;
  results.productCount = await analytics.productCount();
  results.categoryCount = await analytics.categoryCount();
  results.stateCount = (await analytics.uniqueStates()).length;
  results.productRevenues = await analytics.revenueByProduct();
  results.stateRevenues = await analytics.revenueByState();
  results.categoryRevenues = await analytics.revenueByCategory();
  return results;
}

module.exports = analytics;
