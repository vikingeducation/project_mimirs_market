const models = require("./../models/sequelize");

module.exports = {
	listProducts: (req, res) => {
		let params = {
			include: [
				{
					model: models.Category
				}
			],
			order: [["name", "ASC"]]
		};

		if (Object.keys(req.query).length) {
			params = parseParams(params, req.query);
		}

		models.Product.findAll(params).then(products => {
			models.Category.findAll({ order: ["id"] }).then(categories => {
				res.render("index", { products, categories });
			});
		});
	},

	singleProduct: (req, res) => {
		const id = req.params.id;
		models.Product
			.findById(id, {
				include: [
					{
						model: models.Category
					}
				]
			})
			.then(product => {
				models.Product
					.findAll({
						where: { categoryId: product.categoryId, id: { $ne: product.id } },
						limit: 6,
						include: [
							{
								model: models.Category
							}
						]
					})
					.then(relatedProducts => {
						res.render("product", { product, relatedProducts });
					});
			});
	},

	showCart: (req, res) => {
		let quantities = {};
		let productIds = [];

		if (req.session.cart) {
			productIds = req.session.cart.map(item => {
				quantities[item.id] = item.quantity;
				return item.id;
			});
		}

		models.Product
			.findAll({ where: { id: { in: productIds } } })
			.then(products => {
				let sum = 0;
				products.forEach(product => {
					sum += product.price * quantities[product.id];
					product.quantity = quantities[product.id];
				});

				res.render("cart", { products: products, sum: sum });
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

	if (query.category.length) {
		params.where["categoryId"] = query.category;
	}

	params.where["price"] = {
		$gte: query.minPrice,
		$lte: query.maxPrice
	};

	if (query.sortBy) {
		const sort = query.sortBy.split("-");
		params.order = [[sort[0], sort[1]]];
	}

	return params;
}
