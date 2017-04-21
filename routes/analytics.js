const express = require("express");
const router = express.Router();
const Promise = require('bluebird');

const analytics = require("../lib/analytics");

// Sample Order document
//
// { __v: 0,
//   updatedAt: 2017-04-21T15:32:06.696Z,
//   createdAt: 2017-04-21T15:32:06.696Z,
//   fname: 'Donald',
//   lname: 'Trump',
//   email: 'thedonald@yuge.com',
//   street: '1600 Pennsylvania Avenue',
//   city: 'Washington, D.C.',
//   state: 'DC',
//   products:
//    [ { quantity: 2,
//        sku: 'B1YbtEqwCg',
//        description: 'Ut molestiae odit ut.',
//        price: 27.92,
//        name: 'Intelligent Metal Pizza',
//        category: 'Tools',
//        id: 74 },
//      { quantity: 1,
//        sku: 'HJl_4qP0x',
//        description: 'Eos minus in labore.',
//        price: 44.79,
//        name: 'Sleek Frozen Pizza',
//        category: 'Jewelery',
//        id: 2 },
//      { quantity: 5,
//        sku: 'Ske-OE9DRg',
//        description: 'Officiis consequatur quam nihil ut rerum odio et odio iste.',
//        price: 99.91,
//        name: 'Generic Granite Pizza',
//        category: 'Kids',
//        id: 5 } ],
//   stripe:
//    { transfer_group: null,
//      status: 'succeeded',
//      statement_descriptor: null,
//      source_transfer: null,
//      source:
//       { tokenization_method: null,
//         name: 'thedonald@yuge.com',
//         last4: '4242',
//         funding: 'credit',
//         fingerprint: 'euTAzKCyxMcMSGC9',
//         exp_year: 2018,
//         exp_month: 1,
//         dynamic_last4: null,
//         cvc_check: 'pass',
//         customer: null,
//         country: 'US',
//         brand: 'Visa',
//         address_zip_check: null,
//         address_zip: null,
//         address_state: null,
//         address_line2: null,
//         address_line1_check: null,
//         address_line1: null,
//         address_country: null,
//         address_city: null,
//         object: 'card',
//         id: 'card_1AB3jrGnwiXPkfuYoxtFhSlF' },
//      shipping: null,
//      review: null,
//      refunds:
//       { url: '/v1/charges/ch_1AB3juGnwiXPkfuY16Oduq90/refunds',
//         total_count: 0,
//         has_more: false,
//         data: [],
//         object: 'list' },
//      refunded: false,
//      receipt_number: null,
//      receipt_email: null,
//      paid: true,
//      outcome:
//       { type: 'authorized',
//         seller_message: 'Payment complete.',
//         risk_level: 'normal',
//         reason: null,
//         network_status: 'approved_by_network' },
//      order: null,
//      on_behalf_of: null,
//      livemode: false,
//      invoice: null,
//      failure_message: null,
//      failure_code: null,
//      dispute: null,
//      destination: null,
//      description: 'purchase',
//      customer: null,
//      currency: 'usd',
//      created: 1492788726,
//      captured: true,
//      balance_transaction: 'txn_1AB3juGnwiXPkfuYFxU0Iedw',
//      application_fee: null,
//      application: null,
//      amount_refunded: 0,
//      amount: 60017,
//      object: 'charge',
//      id: 'ch_1AB3juGnwiXPkfuY16Oduq90' },
//   stripeToken: 'tok_1AB3jrGnwiXPkfuYo8DabuQD',
//   revenue: 600.18,
//   quantity: 8,
//   _id: 58fa25f6f9711f374a49890b }


// router.get('/', (req, res, next) => {
//   let total,
//       productRevenues,
//       stateRevenues,
//       categoryRevenues;
//
//   Promise.all([
//     analytics.overview(),
//     analytics.customerCount(),
//     analytics.productCount(),
//     analytics.categoryCount(),
//     analytics.stateCount()
//   ])
//   .spread((overview, customerCount, productCount, categoryCount, stateCount) => {
//
//       // [ { revenue: 742.1299999999999, quantity: 11, transactions: 2 } ],
//       // 2,
//       // 100,
//       // 10,
//       // 2
//
//     overview = overview[0];
//     total = {
//       revenue: overview.revenue,
//       quantity: overview.quantity,
//       transactions: overview.transactions,
//       customerCount,
//       productCount,
//       categoryCount,
//       stateCount
//     };
//
//     return analytics.revenueByProduct();
//   }).then(results => {
//     productRevenues = results;
//     return analytics.revenueByState();
//   }).then(results => {
//     stateRevenues = results;
//     return analytics.revenueByCategory();
//   }).then(results => {
//     categoryRevenues = results;
//     res.render('analytics/index', { total, productRevenues, stateRevenues });
//   })
//   .catch(next);
// });

// Results from await async
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


router.get('/', (req, res, next) => {
  analytics.getAll()
    .then(results => {
      res.render('analytics/index', { results })
    })
    .catch(next);
});

module.exports = router;
