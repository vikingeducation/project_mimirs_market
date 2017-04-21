const express = require("express");
const router = express.Router();

const analytics = require("../lib/analytics");

// Sample result from analytics.getAll()
//
// { overview: { revenue: 742.1299999999999, quantity: 11, transactions: 2 },
//   customerCount: 2,
//   productCount: 100,
//   categoryCount: 10,
//   stateCount: 2,
//   revenueByProduct:
//    [ { name: 'Generic Granite Pizza', revenue: 499.54999999999995 },
//      { name: 'Practical Cotton Keyboard', revenue: 18.78 },
//      { name: 'Practical Plastic Chair', revenue: 70.42 },
//      { name: 'Awesome Cotton Gloves', revenue: 52.75 },
//      { name: 'Sleek Frozen Pizza', revenue: 44.79 },
//      { name: 'Intelligent Metal Pizza', revenue: 55.84 } ],
//   revenueByState:
//    [ { name: 'DC', revenue: 600.18 },
//      { name: 'AL', revenue: 141.95 } ],
//   revenueByCategory:
//    [ { name: 'Jewelery', revenue: 115.21000000000001 },
//      { name: 'Tools', revenue: 55.84 },
//      { name: 'Home', revenue: 18.78 },
//      { name: 'Kids', revenue: 552.3 } ] }

// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', (req, res, next) => {
  analytics.getAll()
    .then(results => {
      res.render('analytics/index', { results })
    })
    .catch(next);
});

module.exports = router;
