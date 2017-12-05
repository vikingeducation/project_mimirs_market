var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var Product = models.Product;
var Category = models.Category;

var findCartItem = function(cart, id) {
	return cart.findIndex(i => i.id == id);
};


router.post("/cart/:id", (req, res) => {
	var id = req.params.id;
	var name = req.body.name;

	if (req.session.cart == null || req.session.cart == undefined) {
		req.session.cart = [];
		req.session.cart.push({
			name: name,
			id: id,
			quantity: 1
		});
	} else if (findCartItem(req.session.cart, id) == -1) {
		req.session.cart.push({
			name: name,
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


router.get("/mycart", (req, res) => {
	if (req.session.cart.length == 0) {
		var nothing = true;
		res.render("cart/index", { nothing });
	} else {
		var ids = req.session.cart.map(k => k.id);
		var quantities = req.session.cart.map(k => k.quantity);

		Product.findAll({
			include: [{ model: Category }],
			where: { id: { $in: ids } }
		})
			.then(cartProducts => {
				var total = 0;
				for (var i = 0; i < cartProducts.length; i++) {
					total += cartProducts[i].price * quantities[i];
				}

				var result = cartProducts.map(x =>
					Object.assign(x, req.session.cart.find(y => y.id == x.id))
				);

				res.render("cart/index", { result, total });
			})
			.catch(e => {
				res.status(500).send(e.stack);
			});
	}
});


router.get("/mycart/clear", (req, res) => {
	req.session.cart = null;
	console.log("delete cart");
	res.redirect("/");
});


router.get("/mycart/delete/:id", (req, res) => {
	var id = req.params.id;
	var index = findCartItem(req.session.cart, id);
	req.session.cart.splice(index, 1);
	res.redirect("back");
});


router.post("/mycart/update/:id", (req, res) => {
	var id = req.params.id;
	var quantity = parseInt(req.body.quantity);
	var index = findCartItem(req.session.cart, id);

	console.log("quantity: " + quantity);
	if (quantity <= 0) {
		// remove from cart
		req.session.cart.splice(index, 1);
	} else {
		req.session.cart[index].quantity = quantity;
	}

	res.redirect("/mycart");
});

module.exports = router;