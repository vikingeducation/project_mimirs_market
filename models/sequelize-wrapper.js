const ModelWrapper = require('./model-wrapper');
const MODEL_USER = 'User';
const MODEL_PRODUCT = 'Product';
const MODEL_ORDER = 'Order';
const MODEL_CATEGORY = 'Category';

const ORM_SEQUELIZE = 'sequelize';

class SequelizeWrapper extends ModelWrapper {
	constructor(db) {
		super(db);
		this.type = ORM_SEQUELIZE;
	}

	/******************************
   * USERS
   */
	findAllUsers(options) {
		return this.findAll(MODEL_USER, options);
	}

	findUserById(id) {
		return this.findById(MODEL_USER, id);
	}

	/******************************
   * PRODUCTS
   */
	getProductCount(options) {
		return this.getCount(MODEL_PRODUCT, options);
	}

	findAllProducts(options) {
		return this.findAll(MODEL_PRODUCT, options);
	}

	findAllProductsAndGroup(options, groupNum, shuffle) {
		groupNum = groupNum || 3;
		const promises = [
			this.findAllProducts(options),
			this.getProductCount(options)
		];

		return Promise.all(promises).then(results => {
			let [rawProducts, productCount] = results;
			const products = [];
			let count = 0;

			if (shuffle) {
				rawProducts = shuffle(rawProducts);
			}

			if (groupNum !== undefined && groupNum > 1) {
				rawProducts.forEach((product, i) => {
					if (!Array.isArray(products[count])) {
						products[count] = [];
					}
					products[count][i % groupNum] = product;
					if (i % groupNum === groupNum - 1) {
						count++;
					}
				});
			}
			return [products, productCount];
		});

		function shuffle(array) {
			var currentIndex = array.length,
				temporaryValue,
				randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}
	}

	findProductsByCategory(categoryId, groupNum, shuffle = false) {
		if (categoryId === undefined) {
			return Promise.resolve([]);
		}

		return this.findAllProductsAndGroup(
			{ where: { categoryId: categoryId } },
			groupNum,
			shuffle
		);
	}

	refineProducts(criteria, groupNum) {
		let queryObj = this.getRefineQuery(criteria);

		return this.findAllProductsAndGroup(queryObj, groupNum);
	}

	getRefineQuery(criteria) {
		let searchObj = this.buildSearchQuery(criteria);
		let filterObj = this.buildFilterQuery(criteria);
		let sortObj = this.buildSortQuery(criteria);
		return this.mergeBuiltQueries(searchObj, filterObj, sortObj);
	}

	buildSearchQuery(criteria) {
		if (
			criteria === undefined ||
			criteria.search === undefined ||
			criteria.search.length === 0
		) {
			return {};
		}

		return {
			where: {
				$or: [
					{ name: { $ilike: `%${criteria.search}%` } },
					{ sku: { $ilike: `%${criteria.search}%` } },
					{ desc: { $ilike: `%${criteria.search}%` } }
				]
			}
		};
	}

	buildFilterQuery(criteria) {
		if (
			criteria === undefined ||
			criteria.filter === undefined ||
			(criteria.filter.categoryId === undefined &&
				criteria.filter.minPrice === undefined &&
				criteria.filter.maxPrice === undefined)
		) {
			return {};
		}

		let { categoryId, minPrice, maxPrice } = criteria.filter;
		let filterObj = {
			where: {}
		};

		if (categoryId !== -1) {
			filterObj.where.categoryId = +categoryId;
		}

		filterObj.where.price = {
			$and: [
				{
					$lte: +maxPrice === -1 ? Number.MAX_VALUE : +maxPrice
				},
				{
					$gte: +minPrice === -1 ? 0 : +minPrice
				}
			]
		};
		return filterObj;
	}

	buildSortQuery(criteria) {
		if (
			criteria === undefined ||
			criteria.sort === undefined ||
			criteria.sort.length === 0 ||
			criteria.sort === '-1'
		) {
			return [];
		}

		let sort = criteria.sort;
		let space = sort.indexOf(' ');
		if (space !== -1) {
			sort = [sort.split(' ')];
		} else {
			sort = [[sort]];
		}

		return {
			order: sort
		};
	}

	mergeBuiltQueries(searchObj, filterObj, sortObj) {
		let queryObj = {
			where: {},
			order: [],
			limit: 9
		};

		if (searchObj.where !== undefined) {
			queryObj.where['$or'] = searchObj.where['$or'];
		}
		if (filterObj.where !== undefined) {
			if (filterObj.where.categoryId !== -1) {
				queryObj.where.categoryId = filterObj.where.categoryId;
			}
			queryObj.where.price = filterObj.where.price;
		}

		if (sortObj.order !== undefined) {
			queryObj.order = sortObj.order;
		}

		return queryObj;
	}

	findProductById(id, options) {
		return this.findById(MODEL_PRODUCT, id, options);
	}

	/******************************
   * CATEGORY
   */
	findAllCategories(options) {
		return this.findAll(MODEL_CATEGORY, options);
	}

	findCategoryById(id) {
		return this.findById(MODEL_CATEGORY, id);
	}
}

module.exports = SequelizeWrapper;
