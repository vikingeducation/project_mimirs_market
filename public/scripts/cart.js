$(function() {
	$('#cart-list form').on('submit', function(e) {
		let $target = $(e.target);
		if (!$target.is('form')) {
			return false;
		}
		e.preventDefault();

		let $input = $target.find('input[type=number]');
		if ($input.length === 1) {
			let quantity = +$input.val();
			let productId = +$input.data('product-id');

			$.post({
				url: `/api/cart/${productId}/${quantity}`,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-HTTP-Method-Override', 'PATCH');
				}
			}).done(function(data) {
				$('#cart-products-container').replaceWith(data);
			});
		}
	});
	$('.cart-checkout-btn').on('click', function(e) {
		window.location = '/orders';
	});
	$('.cart-clear-btn').on('click', function(e) {
		$('#confirmModal').modal('show');
	});
	$('#cart-confirm-clear-btn').on('click', function(e) {
		$.post({
			url: `/cart/clear`,
			xhrFields: {
				withCredentials: true
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
			}
		}).done(function(data) {
			$('#cart-products-container').replaceWith(data);
		});
	});
});
