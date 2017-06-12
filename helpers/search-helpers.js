const _ = require('lodash');

const defaults = {
  "name": "",
  "minPrice": "0.00",
  "maxPrice": "1000.00",
  "category": "",
};

const parseQuery = search => {
  let results = {};
  if (!search) {
    results = {
      "name": "",
      "minPrice": "",
      "maxPrice": "",
      "category": "",
    };
  } else {
    results = search;
  }

  return results;
};

const setDefaults = search => {
  let results = {};

  for (let key in search) {
    if (!search[key]){
      results[key] = defaults[key];
    } else {
      results[key] = search[key];
    }
  }

  return results;
};

// formats query appropriately for sequelize
// as Javascript passes objects by reference,
// we clone search query in order to have access to it later for
// placeholder values in html form
const formatQuery = search => {
  let results = _.cloneDeep(search);
  results.name = {
    $ilike: `%${ results.name }%`
  };

  results.price = {
    $between: [results.minPrice, results.maxPrice]
  };

  delete results.minPrice;
  delete results.maxPrice;

  if (!results.category) {
    delete results.category;
  } else {
    results.categoryId = results.category;
    delete results.category;
  }
  return results;
};

module.exports = {
  parseQuery,
  setDefaults,
  formatQuery
};