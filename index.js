// const mongoose = require("mongoose");
// const models = require("./../../models/mongoose");
//
// // Getting product info from sequelize model
// const models = require("./models/sequelize");
// const Product = models.Product;
// //
// //
// // db.Product.findAll().then(results => {
// //   let products = results.map(item => item.dataValues);
// // }).then(() => )
//
// // db.Product.findAll({
// //   include: [
// //     { // Notice `include` takes an ARRAY
// //       model: db.Category
// //     }
// //   ]
// // }).then(results => results.map(item => item.dataValues))
// // .then(products => products.forEach((product) => console.log(product.Category)))
// // .catch(console.error)
//
// // const { Charge, Order, OrderItem } = models;
// Product.findAll({include: models.Category})
// .then(products => { console.log(products) })


// const faker = require("faker");
// const { generate } = require("random-image-url")
// console.log(generate());

// console.log(faker.fake(`ProductName: {{commerce.productName}}`));
// console.log(faker.fake(`Product: {{commerce.department}}`));
// console.log(faker.fake(`{{finance.bitcoinAddress}}`))
