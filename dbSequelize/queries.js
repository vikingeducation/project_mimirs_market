const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const _ = require("lodash");

const queryFind = function(queryParams) {
  let queryOptions = { include: models.Category };

  // andArray for filters
  let andArray = [];
  genFilterArray(queryParams.filter, andArray);
  genSearch(queryParams.search, andArray);

  queryOptions.where = { $and: andArray }
  queryOptions.order = genSort(queryParams.sortType)

  return Product.findAll(queryOptions)
  .then(products => {
      return products.map(product => product.dataValues);
  })
}

const genFilterArray = function(filterObj, andArray) {
  if(_.isEmpty(filterObj)) {
    return andArray;
  }
  if(filterObj.categoryId) andArray.push({ CategoryId: filterObj.categoryId });
  if(filterObj.minPrice.length > 0) andArray.push({ price: { $gte: parseInt(filterObj.minPrice) } });
  if(filterObj.maxPrice.length > 0) andArray.push({ price: { $lte: parseInt(filterObj.maxPrice) } });
}

const genSort = function(sortString) {
  switch(sortString) {
    case "nameAsc":
      return [['name']]
    case "nameDsc":
      return [['name', 'DESC']]
    case "priceAsc":
      return [['price']]
    case "priceDsc":
      return [['price', 'DESC']]
    case "newestFirst":
      return [['createdAt', 'DESC']]
    case "oldestFirst":
      return [['createdAt']]
    default:
      return []
  }
}

// IMPLEMENT CATEGORY WHEN YOU HAVE TIME LATER
const genSearch = function(stringSearch, andArray) {
  if(!stringSearch) return;
  andArray.push({
    $or: [
    { description: { $iLike: `%${stringSearch}%`} },
    { name: { $iLike: `%${stringSearch}%`} }
   ]
 })
}

const getProductPageInfo = function(productId, CategoryId) {
  return Product.findAll({
    include: models.Category,
    where: { CategoryId: CategoryId }
  })
  .then(results => {
      let products = results.map(product => product.dataValues);
      let productSel = {};
      products.forEach((product, index) => {

        if(product.id === parseInt(productId)) {
          productSel = products.splice(index, 1);
        }
      })
      return { productSel, products };
  })
}



module.exports = {
  queryFind,
  getProductPageInfo
}
