var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

router.get("/", (req, res) => {
	// Find all products
	Categories.findAll({}).then(categories => {
		Products.findAll({
			include: [{ model: Categories }],
			limit: 16
		})
			.then(products => {
				res.render("products/index", { products, categories });
				// console.log("categories: ", JSON.stringify(categories, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
});

router.post("/search", (req, res) => {
	var params = {};
	params.search = req.body.search;
	params.category = req.body.category;

	// console.log("params.category", params.category);
	// Find seach params
	if (params.category == "" && params.search == "") {
		Products.findAll({
			include: [{ model: Categories }]
		})
			.then(products => {
				res.render("products/index", { products, params });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	} else if (params.category != "" && params.search == "%%") {
		Products.findAll({
			include: [
				{
					model: Categories,
					where: {
						name: {
							$like: `${params.category}%`
						}
					}
				}
			]
		})
			.then(products => {
				res.render("products/index", { products, params });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	} else if (params.category == "") {
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
				]
			}
		})
			.then(products => {
				res.render("products/index", { products, params });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	} else {
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
				]
			}
		})
			.then(products => {
				res.render("products/index", { products, params });
				// console.log("products: ", JSON.stringify(products, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	}
});

module.exports = router;
