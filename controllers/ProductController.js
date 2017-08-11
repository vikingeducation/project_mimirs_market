const getModelWrapper = require('../models/index');

/**
 * ProductController.js
 *
 * @description :: Server-side logic for managing Products.
 */
module.exports = {
	/**
   * ProductController.index()
   */
	index: function(req, res) {
		const wrapper = getModelWrapper();

		if (req.query.ps) {
			res.locals.paymentSuccessful = true;
		}

		Promise.all([
			wrapper.findAllProductsAndGroup(
				{ limit: wrapper.db.Product.RESULTS_PER_PAGE },
				3
			),
			wrapper.findAllCategories()
		])
			.then(_renderProductsIndex)
			.catch(_catchError.call(res, 'Error getting products from database.'));

		function _renderProductsIndex(data) {
			const [productResults, categories] = data;
			const [products, count] = productResults;

			const userCart = req.session.cart;

			res.render('products/index', {
				products: products,
				categories: categories,
				paginationData: {
					currentPage: 0,
					pageCount: Math.ceil(count / wrapper.db.Product.RESULTS_PER_PAGE)
				},
				crumbs: [
					{ href: '/products', name: 'Home' },
					{ href: '', name: 'Products' }
				],
				showRefineWidget: true,
				userCart: userCart
			});
		}
	},

	paginate: function(req, res) {
		// Extract the page we're requesting.
		const requestedPage = req.params.page || 0;
		req.session.currentPage = requestedPage;

		const wrapper = getModelWrapper();
		const resultLimit = wrapper.db.Product.RESULTS_PER_PAGE;

		// Get our refine query.
		const refine = req.session.refine || {};
		const query = wrapper.getRefineQuery(req.session.refine);
		query.limit = resultLimit;
		query.offset = requestedPage * resultLimit;
		wrapper
			.findAllProductsAndGroup(query, 3)
			.then(_renderRefineIndex.call(res, req));
	},

	/**
   * ProductController.view()
   */
	view: function(req, res) {
		var id = req.params.id;
		const wrapper = getModelWrapper();
		wrapper
			.findProductById(id, {
				include: [
					{ model: wrapper.db.Category },
					{
						as: 'RelatedProducts',
						model: wrapper.db.Product,
						where: { id: { $ne: `${id}` } }
					}
				]
			})
			.then(_renderProductsView);

		function _renderProductsView(product) {
			const userCart = req.session.cart;

			res.render('products/view', {
				product: product,
				crumbs: [
					{ href: '/products', name: 'Home' },
					{ href: '/products', name: 'Products' },
					{ href: '', name: `${product.name}` }
				],
				userCart: userCart
			});
		}
	},

	/**
	 * ProductController.refine()
	 */
	refine: function(req, res) {
		const refine = req.body.refine || req.session.refine;
		req.session.refine = refine;
		const wrapper = getModelWrapper();
		wrapper.refineProducts(refine, 3).then(_renderRefineIndex.call(res, req));
	}
};

function _catchError(msg) {
	return err => {
		this.status(500).json({
			message: msg,
			error: err
		});
	};
}

/**
 * this = express.Response;
 */
function _renderRefineIndex(req) {
	return results => {
		const [products, count] = results;
		const pageCount = Math.ceil(
			count / getModelWrapper().db.Product.RESULTS_PER_PAGE
		);
		let currentPage = req.session.currentPage ? req.session.currentPage : 0;
		if (currentPage > pageCount) {
			currentPage = pageCount - 1;
			req.session.currentPage = currentPage;
		}
		this.render('refine/products/index', {
			products: products,
			paginationData: {
				currentPage: currentPage,
				pageCount: pageCount
			},
			layout: false
		});
	};
}
