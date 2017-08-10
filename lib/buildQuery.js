const sqlModels = require("./../models/sequelize");

const buildQuery = query => {
  let base = {
    include: [
      {
        model: sqlModels.Category
      }
    ],
    limit: 18
  };

  if (query.category) {
    if (query.category.length) {
      findCategory = query.category;
    } else {
      findCategory = {
        $gte: 0
      };
    }
    base.where = {
      categoryId: findCategory,
      price: {
        $gte: query.minPrice,
        $lte: query.maxPrice
      }
    };
  }
  if (query.search) {
    base.where = {
      name: {
        $ilike: `%${query.search}%`
      }
    };
  }
  if (query.sortBy) {
    let sorted = query.sortBy.split(",");
    base.order = [sorted];
  }
  console.log(base);
  return base;
};

module.exports = buildQuery;
