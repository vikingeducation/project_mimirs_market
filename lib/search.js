const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

const search = {};

search.findEverything = (req, res) => {
	Categories.findAll({}).then(categories => {
		Products.findAll({
			include: [{ model: Categories }],
			limit: 20
		})
			.then(products => {
				res.render("products/index", { products, categories });
				// console.log("categories: ", JSON.stringify(categories, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
};

search.filter = (req, res, params) => {
	Categories.findAll({}).then(categories => {
		Products.findAll({
			include: [{ model: Categories }],
			where: {
				price: {
					$gte: params.priceMin,
					$lte: params.priceMax
				}
			},
			order: [[params.sortVal, params.sortDirection]],
			limit: 20
		})
			.then(products => {
				res.render("products/index", { products, categories });
				// console.log("categories: ", JSON.stringify(categories, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
};

search.findCategoriesButNotText = (req, res, params) => {
	Categories.findAll({}).then(categories => {
		Products.findAll({
			include: [
				{
					model: Categories,
					where: {
						name: {
							$like: `${params.category}%`
						},
						price: {
							$gte: params.priceMin,
							$lte: params.priceMax
						}
					}
				}
			],
			order: [[params.sortVal, params.sortDirection]]
		})
			.then(products => {
				res.render("products/index", { products, params, categories });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
};

search.findTextButNotCategories = (req, res, params) => {
	Categories.findAll({}).then(categories => {
		Products.findAll({
			include: [
				{
					model: Categories
				}
			],
			where: {
				$or: [
					{
						name: {
							$ilike: `%${params.search}%`
						}
					},
					{
						description: {
							$ilike: `%${params.search}%`
						}
					}
				],
				price: {
					$gte: params.priceMin,
					$lte: params.priceMax
				}
			},
			order: [[params.sortVal, params.sortDirection]]
		})
			.then(products => {
				res.render("products/index", { products, params, categories });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
};

search.findTextandCategories = (req, res, params) => {
	Categories.findAll({}).then(categories => {
		Products.findAll({
			include: [
				{
					model: Categories,
					where: {
						name: {
							$ilike: `${params.category}%`
						}
					}
				}
			],
			where: {
				$or: [
					{
						name: {
							$ilike: `%${params.search}%`
						}
					},
					{
						description: {
							$ilike: `%${params.search}%`
						}
					}
				],
				price: {
					$gte: params.priceMin,
					$lte: params.priceMax
				}
			},
			order: [[params.sortVal, params.sortDirection]]
		})
			.then(products => {
				res.render("products/index", { products, params, categories });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
};

module.exports = search;
