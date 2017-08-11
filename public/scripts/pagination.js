$(paginationClickHandler);

function paginationClickHandler() {
	const $paginator = $('.pagination-container');
	$paginator.on('click', 'li a', function(e) {
		let $target = $(e.target);
		if (!$target.is('a')) {
			$target = $target.parents('a');
		}
		e.preventDefault();

		const href = $target.prop('href');
		$.get(href).done(function(productsByGroup) {
			$('#products-list').html(productsByGroup);
			paginationClickHandler();
		});
		return true;
	});
}
