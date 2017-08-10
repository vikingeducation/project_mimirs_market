// const mongoose = require("mongoose");
// const models = require("./../../models/mongoose");
//
// // Getting product info from sequelize model
const db = require("./../../models/sequelize");
//
//
// db.Product.findAll().then(results => {
//   let products = results.map(item => item.dataValues);
// }).then(() => )

db.Product.findAll({
  include: [{// Notice `include` takes an ARRAY
    model: db.Category
  }]
})
.then(results => results.map(item => item.dataValues))
.then(products => products.forEach((product) => console.log(product.Category)))
.catch(console.error)


// const { Charge, Order, OrderItem } = models;
