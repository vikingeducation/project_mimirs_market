var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

const search = require("./../lib/search");

//index
router.get("/", (req, res) => {
	// Find all products
	search.findEverything(req, res);
});

// search
router.post("/search", (req, res) => {
	var params = {};
	params.search = req.body.search;
	params.category = req.body.category;
	params.priceMin = req.body.priceMin;
	params.priceMax = req.body.priceMax;
	params.sortVal = req.body.sortVal;
	params.sortDirection = req.body.sortDirection;

	// Find search params
	if (params.category == "" && params.search == "") {
		//if the search params and categories are empty then find findEverything
		search.filter(req, res, params);
	} else if (params.category != "" && params.search == "%%") {
		search.findCategoriesButNotText(req, res, params);
	} else if (params.category == "") {
		search.findTextButNotCategories(req, res, params);
	} else {
		search.findTextandCategories(req, res, params);
	}
});

// product show page
router.get("/product/:id", (req, res) => {
	//find one product
	Products.findOne({
		include: [
			{
				model: Categories
			}
		],
		where: {
			id: req.params.id
		}
	}).then(product => {
		//find the products related to it
		Products.findAll({
			include: [
				{
					model: Categories,
					where: {
						name: product.Category.name
					}
				}
			],
			limit: 12
		})
			.then(relatedProducts => {
				res.render("products/show", { product, relatedProducts });
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	});
});

// Add to cart
router.post("/cart", (req, res) => {
	var id = req.body.id;

	if (req.session.cart == null || req.session.cart == undefined) {
		req.session.cart = [];
		req.session.cart.push({
			id: id,
			quantity: 1
		});
	} else if (req.session.cart.findIndex(i => i.id === id) == -1) {
		req.session.cart.push({
			id: id,
			quantity: 1
		});
	} else {
		req.session.cart.forEach(obj => {
			if (obj.id == id) {
				obj.quantity += 1;
			}
		});
	}

	res.redirect("back");
});

module.exports = router;
