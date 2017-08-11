'use strict';
module.exports = function(sequelize, DataTypes) {
	class Product extends sequelize.Model {
		static associate(models) {
			Product.belongsTo(models.Category, {
				sourceKey: 'id',
				foreignKey: 'categoryId'
			});
			Product.hasMany(models.Product, {
				as: 'RelatedProducts',
				sourceKey: 'categoryId',
				foreignKey: 'categoryId'
			});
		}

		get shortDesc() {
			return this.desc.split(' ').slice(0, 30).join(' ').concat('...');
		}

		get prettyPrice() {
			return this.price.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			});
		}

		get created() {
			let date = new Date(this.createdAt);
			return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
		}

		get updated() {
			let date = new Date(this.updatedAt);
			return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
		}
	}
	Product.RESULTS_PER_PAGE = 9;
	Product.init(
		{
			name: DataTypes.STRING,
			img: DataTypes.STRING,
			sku: DataTypes.STRING,
			desc: DataTypes.TEXT,
			price: DataTypes.REAL,
			categoryId: DataTypes.INTEGER
		},
		{ sequelize }
	);

	Product.hook('afterFind', product => {
		if (!Array.isArray(product)) {
			if (
				product.RelatedProducts !== undefined &&
				Array.isArray(product.RelatedProducts)
			) {
				// Limit on include wasn't working correctly.
				product.RelatedProducts = product.RelatedProducts.slice(0, 20);

				// Group related products by 3
				let relatedProducts = [];
				let count = 0;
				product.RelatedProducts.forEach((product, i) => {
					if (!Array.isArray(relatedProducts[count])) {
						relatedProducts[count] = [];
					}
					relatedProducts[count][i % 4] = product;
					if (i % 4 === 3) {
						count++;
					}
				});
				relatedProducts[0].first = true;
				product.RelatedProducts = relatedProducts;
			}
		}
	});

	return Product;
};
