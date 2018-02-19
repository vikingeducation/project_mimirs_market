// ---------------------------------------------------------
// Helper functions
// 2017-12-08 07:15
// ---------------------------------------------------------

const models = require("./models/sequelize");
const [ Category, Product ] = [ models.Category, models.Product ];

const queryConstructor = (searchTerm, category, min, max) => {
  let query = {};
  query["include"] = [{model:Category}];
  if (category) query.include[0].where = {
    name: category
  };  
  query["where"] = { $and: [] };
  if (searchTerm) query.where.$and.push({
      name: {
        $ilike: `%${searchTerm}%`
      }
  });
  if (min) query.where.$and.push({
    price: {
      $gte: min
    }
  });
  if (max) query.where.$and.push({
    price: {
      $lte: max
    }
  });
  //console.log("------------------- START query -------------------");
  //console.log(JSON.stringify(query, null, 2));
  //console.log("-------------------- END query --------------------");
  
  return query;
}

const objectify = (queryObj) => {
//  console.log("queryObj: ", queryObj);
  
  return {
    id: queryObj.id,
    name: queryObj.name,
    sku: queryObj.sku,
    description: queryObj.description,
    price: queryObj.price,
    image: queryObj.image,
    category: queryObj.dataValues.Category ? queryObj.dataValues.Category.dataValues.name : null
  }
};

module.exports = {
  queryConstructor,
  objectify
}
