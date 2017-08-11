const getModelWrapper = require('../models');
const UTIL = require('../util');

/**
 * CartController.js
 *
 * @description :: Server-side logic for managing the user's cart.
 */
module.exports = {
	/**
   * CartController.index()
   */
	index: function(req, res) {
		// Get related products for all products in the cart.
		let categories = [],
			foundHash = {};
		if (req.session.cart !== undefined && req.session.cart.length > 0) {
			req.session.cart.forEach(productObj => {
				let categoryId = productObj.product.categoryId;
				if (foundHash[categoryId] === undefined) {
					foundHash[categoryId] = true;
					categories.push(categoryId);
				}
			});
		}

		// Needed if we have categories for related products.
		// So just use it anyway if we don't have categories.
		let optionsPromise = new Promise(resolve => {
			const options = {
				total: UTIL.calculateTotals(req.session.cart),
				crumbs: [
					{ href: '/products', name: 'Home' },
					{ href: '', name: 'Your Cart' }
				]
			};
			if (req.xhr) {
				options.layout = false;
			}
			resolve(options);
		});

		if (categories.length > 0) {
			let wrapper = getModelWrapper();
			let promises = [
				wrapper.findProductsByCategory(categories, 4, true),
				optionsPromise
			];

			Promise.all(promises).then(results => {
				let [relatedProductGroups, options] = results;
				let [relatedProducts, count] = relatedProductGroups;
				relatedProducts[0].first = true;
				options.relatedProducts = relatedProducts;
				res.render('cart/index', options);
			});
		} else {
			optionsPromise.then(options => {
				res.render('cart/index', options);
			});
		}
	},

	/**
   * CartController.view()
   */
	view: function(req, res) {},

	/**
   * CartController.create()
   */
	create: function(req, res) {
		let wrapper = getModelWrapper();
		const productId = +req.params.id;
		const quantity = req.body.quantity;
		if (req.session.cart === undefined || !Array.isArray(req.session.cart)) {
			req.session.cart = [];
		}
		// Get the product and add it to the session.
		wrapper.findProductById(productId).then(product => {
			let exists = req.session.cart.find(item => {
				return item.product.id === productId;
			});
			if (!exists) {
				product.prettyPrice = product.prettyPrice;
				req.session.cart.push({
					quantity: quantity !== undefined ? quantity : 1,
					product: product
				});
			} else {
				exists.quantity++;
			}
		});

		res.render('cart/add', { userCart: req.session.cart, layout: false });
	},

	update: function(req, res) {
		const productId = +req.params.productId;
		const quantity = +req.params.quantity;
		if (
			productId === undefined ||
			quantity === undefined ||
			isNaN(productId) ||
			isNaN(quantity)
		) {
			return res.status(500).json({
				msg: 'Invalid parameters passed to cart update'
			});
		}
		const cart = req.session.cart;
		if (cart === undefined || !Array.isArray(cart) || cart.length === 0) {
			return res.status(500).json({
				msg: 'Nothing in cart to update quantity for.'
			});
		}

		let exists = cart.find(productObj => productObj.product.id === +productId);
		if (!exists) {
			return res.status(500).json({
				msg: 'Invalid product id passed'
			});
		}
		exists.quantity = quantity;

		// Redirect to index.
		res.redirect('/cart');
	},
	remove: function(req, res) {
		delete req.session.cart;
		res.redirect('/cart');
	}
};
