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

const formatQuery = search => {
  let results = {};
  
  results.name = {
    $ilike: `%${ search.name }%`
  };

  results.price = {
    $between: [search.minPrice, search.maxPrice]
  };

  if (search.category) {
    results.categoryId = search.category;
  }

  return results;
};

module.exports = {
  parseQuery,
  setDefaults,
  formatQuery
};