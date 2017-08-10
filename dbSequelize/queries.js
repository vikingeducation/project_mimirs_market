const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const _ = require("lodash");

const filterFind = function(filterObj) {
  if(_.isEmpty(filterObj)) {
    return Product.findAll({
      include: models.Category
    })
  }
  let andArray = [];

  if(filterObj.categoryId) andArray.push({ CategoryId: filterObj.categoryId });
  console.log(typeof filterObj.minPrice);
  if(filterObj.minPrice.length > 0) andArray.push({ price: { $gte: parseInt(filterObj.minPrice) } });
  if(filterObj.maxPrice.length > 0) andArray.push({ price: { $lte: parseInt(filterObj.maxPrice) } });

  return Product.findAll({
    where: {
      $and: andArray
    },
    include:  models.Category
  })
  .then(products => {
      return products.map(product => product.dataValues);
  })
}


module.exports = filterFind;
