const models = require("./../models/sequelize");

module.exports = {
	listProducts: (req, res) => {
		let params = {
			include: [
				{
					model: models.Category
				}
			]
		};

		if (Object.keys(req.query).length) {
			params = parseParams(params, req.query);
		}

		console.log(params);

		models.Product.findAll(params).then(products => {
			models.Category.findAll({ order: ["id"] }).then(categories => {
				res.render("index", { products, categories });
			});
		});
	}
};

function parseParams(params, query) {
	params.where = {};

	if (query.search) {
		params.where["$or"] = [
			{ name: { $iLike: `%${query.search}%` } },
			{ description: { $iLike: `%${query.search}%` } }
		];
	}

	if (query.category) {
		if (query.category.length) {
			params.where["categoryId"] = query.category;
		}

		params.where["price"] = {
			$gte: query.minPrice,
			$lte: query.maxPrice
		};
	}

	if (query.sortBy) {
		const sort = query.sortBy.split("-");
		params.order = [[sort[0], sort[1]]];
	}

	return params;
}
