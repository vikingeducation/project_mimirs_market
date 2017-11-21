var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

const search = require("./../services/search");

//index
router.get("/", (req, res) => {
	// Find all products
	search.findEverything(req, res);
});

// search
router.post("/search", (req, res) => {
	// serch and filer params
	var params = {};
	params.search = req.body.search;
	params.category = req.body.category;
	params.priceMin = req.body.priceMin;
	params.priceMax = req.body.priceMax;
	params.sortVal = req.body.sortVal;
	params.sortDirection = req.body.sortDirection;

	req.method = "get";

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
	search.findOneProduct(req, res);
});

module.exports = router;
