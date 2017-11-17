var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Products = models.Products;
var Categories = models.Categories;

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

// cart index
router.get("/mycart", (req, res) => {
	if (req.session.cart == null || req.session.cart == undefined) {
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
				//assign quantities
				var total = 0;

				for (var i = 0; i < cartProducts.length; i++) {
					cartProducts[i].quantity = quantities[i];
					total += cartProducts[i].price * quantities[i];
				}

				// console.log("cartProducts: ", JSON.stringify(cartProducts, 0, 2));
				res.render("cart/index", { cartProducts, total });
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	}
});

// clear the entire cart
router.get("/clearcart", (req, res) => {
	req.session.cart = null;
	res.redirect("/");
});

// c

module.exports = router;

//
