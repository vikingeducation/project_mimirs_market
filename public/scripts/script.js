$(function() {
	// Init tooltips
	$('[data-toggle="tooltip"]').tooltip();
	let $addToCartPopOver = $('#product-add-popover');
	$addToCartPopOver.popover({
		placement: 'bottom',
		trigger: 'manual',
		container: 'body'
	});
	$('#products-list').on('click', 'a.add-to-cart-btn', function(e) {
		let $target = $(e.target);
		if (!$target.is('a')) {
			return false;
		}
		e.preventDefault();

		let $quantityInput = $('#quantity');
		let data = {};
		if ($quantityInput.length === 1) {
			data.quantity = +$quantityInput.val().trim();
		}
		console.log(data);
		let href = $target.prop('href');
		$.post({
			url: href,
			data: data,
			xhrFields: {
				withCredentials: true
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-HTTP-Method-Override', 'PUT');
			}
		}).done(function(data) {
			$('#user-cart').replaceWith(data);

			$addToCartPopOver.popover('show');
			setTimeout(() => {
				$addToCartPopOver.popover('hide');
			}, 5000);
		});
	});
});
