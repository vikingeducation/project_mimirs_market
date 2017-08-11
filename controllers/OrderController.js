const getModelWrapper = require('../models');
const { STRIPE_SK, STRIPE_PK } = process.env;

const stripe = require('stripe')(STRIPE_SK);
const UTIL = require('../util');

/**
 * OrderController.js
 *
 * @description :: Server-side logic for managing Orders.
 */
module.exports = {
	/**
   * OrderController.index()
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
		const totals = UTIL.calculateTotals(req.session.cart);
		totals.totalRaw *= 100;
		const options = {
			total: totals,
			crumbs: [
				{ href: '/products', name: 'Home' },
				{ href: '/cart', name: 'Your Cart' },
				{ href: '', name: 'Check Out' }
			],
			STRIPE_PK: STRIPE_PK
		};
		res.render('orders/index', options);
	},

	/**
   * OrderController.view()
   */
	view: function(req, res) {},

	/**
   * OrderController.create()
   */
	create: function(req, res) {
		console.log('ORDER RECEIVED');

		const cart = req.session.cart;
		if (cart === undefined || !Array.isArray(cart) || cart.length === 0) {
			return res.status(500).json({
				msg: 'Error, nothing in your cart'
			});
		}

		// Grab the total amount from our sesion.
		const total = UTIL.calculateTotals(cart).totalRaw;
		console.log(req.session);
		// Grab the billing info from the session.
		const billingData = req.session.billing;
		if (!billingData) {
			return res.status(500).json({
				msg: 'Error, no billing information present.'
			});
		}

		const stripeData = req.body;
		stripe.charges
			.create({
				amount: total,
				currency: 'usd',
				description: 'Someone bought a product BRUH!',
				source: stripeData.stripeToken
			})
			.then(charge => {
				// Extra the data we need from our charge.
				let { amount, created, description } = charge;
				let refund_url = charge.refunds.url;
				const chargeData = {
					amount,
					created,
					description,
					refund_url
				};

				// Create the final collection object.
				const order = {
					cart: cart,
					billing: billingData,
					charge: chargeData
				};
				return order;
			})
			.then(order => {
				// Get our database and create a new order.
				let wrapper = getModelWrapper('mongoose');

				// Save it.
				return wrapper.saveOrder(order);
			})
			.then(() => {
				// Remove items from session.
				delete req.session.billing;
				delete req.session.cart;
				res.redirect('/products/?ps= true');
			})
			.catch(e => res.status(500).send(e.stack));
	},

	saveBilling: function(req, res) {
		console.log('BILLING INFO SAVED');
		const billing = req.body.billing;
		console.log(billing);
		req.session.billing = billing;
		res.end();
	}
};
