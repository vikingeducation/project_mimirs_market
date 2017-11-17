var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

var _ = require("lodash");

var findCartItem = function(cart, id) {
	return cart.findIndex(i => i.id == id);
};

// Add to cart
router.post("/cart", (req, res) => {
	var id = req.body.id;

	if (req.session.cart == null || req.session.cart == undefined) {
		req.session.cart = [];
		req.session.cart.push({
			id: id,
			quantity: 1
		});
	} else if (findCartItem(req.session.cart, id) == -1) {
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

// cart index
router.get("/mycart", (req, res) => {
	if (req.session.cart.length == 0) {
		// if cart is empty
		var nothing = true;
		res.render("cart/index", { nothing });
	} else {
		// get item ids from cart
		var ids = req.session.cart.map(k => k.id);

		// get quantities from cart
		var quantities = req.session.cart.map(k => k.quantity);

		Products.findAll({
			include: [{ model: Categories }],
			where: { id: { $in: ids } }
		})
			.then(cartProducts => {
				var total = 0;
				for (var i = 0; i < cartProducts.length; i++) {
					total += cartProducts[i].price * quantities[i];
				}

				//assign quantities
				var result = cartProducts.map(x =>
					Object.assign(x, req.session.cart.find(y => y.id == x.id))
				);

				res.render("cart/index", { result, total });
				// console.log("result: ", JSON.stringify(result, 0, 2));
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	}
});

// clear the entire cart
router.get("/mycart/delete", (req, res) => {
	req.session.cart = null;
	console.log("delete cart");
	res.redirect("/");
});

// clear one product from cart
router.get("/clear/:id", (req, res) => {
	//clear
	var id = req.params.id;
	var index = findCartItem(req.session.cart, id);
	req.session.cart.splice(index, 1);
	res.redirect("back");
});

// update quantity
router.post("/mycart/updateitem", (req, res) => {
	//update
	var id = req.body.id;
	var quantity = req.body.quantity;
	var index = findCartItem(req.session.cart, id);

	if (quantity <= 0) {
		req.session.cart.splice(index, 1);
	} else {
		req.session.cart[index].quantity = quantity;
	}

	res.redirect("back");
});

module.exports = router;

//
