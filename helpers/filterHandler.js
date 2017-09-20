function filterHandler(query) {
  let searchObj;
  let categoryObj;
//  let sortObj;

  if (query.search) {
    searchObj = { name: { $iLike: `%${query.search}%` } };
  }

  let min = query.min || 0;
  let max = query.max || 999;
  let rangeObj = {price: {$gte: min, $lte: max}};

  if (query.category) {
    let categoriesArray =
      query.category === "Any"
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        : [query.category];
    categoryObj = {CategoryId: {$in: categoriesArray}};
  }

  // if (query.sort) {
  //   sortObj = query.sort;
  // }

  let queryObj = {
    include: [{ all: true }],
    order: _sortHandler(query.sort),
    where: (searchObj && categoryObj) ? {$and: [searchObj, rangeObj, categoryObj]} : {$and: [rangeObj, categoryObj]}
  };

  return queryObj;
}

function _sortHandler (sort){
  let sortValue;
  switch (sort){
    case "nameAsc":
      sortValue=["name"];
      break;
    case "nameDesc":
      sortValue=[["name", "DESC"]];
      break;
    case "priceAsc":
      sortValue=["price"];
      break;
    case "priceDesc":
      sortValue=[["price", "DESC"]];
      break;
    case "createdAsc":
      sortValue=["createdAt"];
      break;
    case "createdDesc":
      sortValue=[['createdAt', 'DESC']];
      break;
    default: 
      sortValue=""
  }
  return sortValue
}

module.exports = filterHandler;
