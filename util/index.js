module.exports = {
	prettyPrice: amt => {
		return amt.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	},
	calculateTotals: cart => {
		// Calculate the cart subtotal, tax, and total.
		const TAX = 0.08;
		let total = {
			subtotal: 0,
			items: 0
		};
		if (cart !== undefined && cart.length > 0) {
			cart.forEach(productObj => {
				total.items++;
				total.subtotal += productObj.quantity * productObj.product.price;
			});
		}
		let subtotalPretty = module.exports.prettyPrice(total.subtotal);
		let taxPretty = module.exports.prettyPrice(total.subtotal * TAX);
		let totalPretty = module.exports.prettyPrice(
			total.subtotal + total.subtotal * TAX
		);

		return {
			items: total.items,
			subtotal: subtotalPretty,
			tax: taxPretty,
			total: totalPretty,
			totalRaw: Math.floor(total.subtotal + total.subtotal * TAX, 2)
		};
	}
};
