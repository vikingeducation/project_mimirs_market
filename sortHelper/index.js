function makeQuery(query) {
  let search;
  let category;
  let sort;
  if (query.search) {
    search = _search(query.search);
  }
  if (query.category) {
    category = _category(query);
  }
  if (query.sort) {
    sort = _order(query.sort);
  }
  return _combine(search, category, sort);
}

module.exports = makeQuery;

function _combine(search, category, sort) {
  let queryObj = { include: [{ all: true }] };
  queryObj.order = sort;
  if (search && category) {
    queryObj.where = { $and: [search, category] };
    console.log(queryObj.where);
  } else {
    queryObj.where = category;
  }
  return queryObj;
}

function _search(term) {
  return { name: { $iLike: `%${term}%` } };
}

function _category(query) {
  let min = query.min || 0;
  let max = query.max || 1000;
  let category = query.category === "All"
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    : [query.category];
  return {
    price: { $gte: min, $lte: max },
    categoryId: { $in: category }
  };
}

function _order(sortSpec) {
  let orderParam;
  switch (sortSpec) {
    case "price":
      orderParam = "price";
      break;
    case "priceDesc":
      orderParam = "price DESC";
      break;
    case "name":
      orderParam = "name";
      break;
    case "nameDesc":
      orderParam = "name DESC";
      break;
    case "created":
      orderParam = '"createdAt"';
      break;
    case "createdDesc":
      orderParam = '"createdAt" DESC';
      break;
    default:
      orderParam = "";
  }
  return `${orderParam}`;
}
