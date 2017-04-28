const Category = require("../models/sequelize").Category;

const buildQuery = query => {
  let searchParams = [];
  let orderParam;
  if (!(Object.keys(query).length === 0)) {
    if (query.search && query.search.length) {
      searchParams.push({ name: { $iLike: `%${query.search}%` } });
    }
    if (query.category && query.category.length) {
      searchParams.push({ categoryId: { $in: [query.category] } });
    }
    if (query.min && query.min.length) {
      searchParams.push({ price: { $gte: query.min }});
    }
    if (query.max && query.max.length) {
      searchParams.push({ price: { $lte: query.max }});
    }
    if (query.sort && query.sort.length) {
      orderParam = query.sort;
    }
  }
  let result = {
    include: [{ model: Category }],
    where: { $and: searchParams }
  };
  if (orderParam) result.order = orderParam;
  return result;
};

module.exports = buildQuery;
