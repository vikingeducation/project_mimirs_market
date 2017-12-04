const models = require('../models/sequelize');
const { Product, Category } = models;

const SearchHandler = {};

SearchHandler.findProducts = query => {
  return new Promise((resolve, reject) => {
    const productQuery = { where: {}, include: { model: Category, as: 'category' } };

    if (query.filter) {
      const categoryId = parseInt(query.filter.category);
      const minPrice = parseInt(query.filter.minPrice);
      const maxPrice = parseInt(query.filter.maxPrice);

      if (categoryId) productQuery.where.categoryId = categoryId;
      if (minPrice || maxPrice) productQuery.where.price = {};
      if (minPrice) productQuery.where.price.$gte = minPrice;
      if (maxPrice) productQuery.where.price.$lte = maxPrice;
    }

    if (query.sortBy) {
      productQuery.order = [];

      switch(query.sortBy) {
        case "nameAsc":
          productQuery.order.push(['name', 'ASC']);
          break;
        case "nameDec":
          productQuery.order.push(['name', 'DESC']);
          break;
        case "priceAsc":
          productQuery.order.push(['price', 'ASC']);
          break;
        case "priceDec":
          productQuery.order.push(['price', 'DESC']);
          break;
        case "newest":
          productQuery.order.push(['createdAt', 'ASC']);
          break;
        case "oldest":
          productQuery.order.push(['createdAt', 'DESC']);
          break;
      }
    }

    if (query.search) {
      const term = query.search;
      productQuery.where.$or = {};
      productQuery.where.$or.name = { ilike: `%${ term }%` };
      productQuery.where.$or.description = { ilike: `%${ term }%` };
      productQuery.where.$or['$category.name$'] = { ilike: `%${ term }%` };
    }

    Product.findAll(productQuery)
      .then(products => {
        resolve(products);
      });
  });
};

SearchHandler.findRelatedProducts = (product) => {
  return new Promise((resolve, reject) => {
    Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: {
          $ne: product.id
        }
      },
      include: [ { model: Category, as: 'category' } ]
    })
      .then(products => {
        resolve(products);
      });
  });
};

SearchHandler.findCartProducts = (cart) => {
  return new Promise((resolve, reject) => {
    let productIds = Object.keys(cart);

    Product.findAll({
      where: {
        id: {
          $in: productIds
        }
      },
      include: [ { model: Category, as: 'category' } ]
    })
      .then(products => {
        for (let product of products) {
          product.quantity = cart[product.id].quantity;
        }

        resolve(products);
      });
  });
};

module.exports = SearchHandler;
