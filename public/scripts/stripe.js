$(function() {
	$('.stripe-button-el').on('click', function(e) {
		// Gather data from billing form.
		let $billingForm = $('#billing-form');
		let billingObj = {};
		$billingForm.find('input, select').each((idx, el) => {
			let $el = $(el);
			billingObj[$el.prop('name')] = $el.val();
		});
		$.post(
			{
				url: '/api/orders/billing',
				xhrFields: {
					withCredentials: true
				}
			},
			billingObj
		);
	});
});
