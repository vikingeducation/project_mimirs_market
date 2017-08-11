$(function() {
	const ID_SEARCH = 'search-form',
		ID_FILTER = 'filter-form',
		ID_SORT = 'sort-form';

	const $refineContainer = $('#refine-container');
	[ID_SEARCH, ID_FILTER, ID_SORT].forEach(id => {
		const $form = $refineContainer.find(`#${id}`);
		if ($form.length === 1) {
			$form.on('submit', function(e) {
				e.preventDefault();

				switch (id) {
					case ID_SEARCH:
						searchHandler($form);
						break;
					case ID_FILTER:
						filterHandler($form);
						break;
					case ID_SORT:
						sortHandler($form);
						break;
				}
			});
		}
	});

	const REFINE_FORM_ACTION = '/api/products/refine';
	function searchHandler($searchForm) {
		const postData = {
			refine: {
				search: getSearchValue($searchForm)
			}
		};

		// Grab filter data.
		const $filterForm = $('#filter-form');
		postData.refine.filter = getFilterValues($filterForm);

		// Grab sort data.
		const $sortForm = $('#sort-form');
		postData.refine.sort = getSortValue($sortForm);

		$.post(REFINE_FORM_ACTION, postData).done(function(productsByGroup) {
			$('#products-list').html(productsByGroup);
			paginationClickHandler();
		});
	}

	function filterHandler($filterForm) {
		const postData = {
			refine: {
				filter: getFilterValues($filterForm)
			}
		};

		// Grab search data.
		const $searchForm = $('#search-form');
		postData.refine.search = getSearchValue($searchForm);

		// Grab sort data.
		const $sortForm = $('#sort-form');
		postData.refine.sort = getSortValue($sortForm);

		$.post(REFINE_FORM_ACTION, postData).done(function(productsByGroup) {
			$('#products-list').html(productsByGroup);
			paginationClickHandler();
		});
	}

	function sortHandler($sortForm) {
		const sortAction = $sortForm.prop('action');

		const postData = {
			refine: {
				sort: getSortValue($sortForm)
			}
		};

		// Grab search data.
		const $searchForm = $('#search-form');
		postData.refine.search = getSearchValue($searchForm);

		// Grab filter data.
		const $filterForm = $('#filter-form');
		postData.refine.filter = getFilterValues($filterForm);

		$.post(REFINE_FORM_ACTION, postData).done(function(productsByGroup) {
			$('#products-list').html(productsByGroup);
			paginationClickHandler();
		});
	}

	function getSearchValue($searchForm) {
		const $searchInput = $searchForm.find('#search');
		if ($searchInput.length === 1) {
			return $searchInput.val().trim();
		}
		return '';
	}

	function getFilterValues($filterForm) {
		const filter = {};
		['categoryId', 'minPrice', 'maxPrice'].forEach(id => {
			const $input = $filterForm.find(`#${id}`);
			if ($input.length === 1) {
				filter[`${id}`] = $input.val().trim();
			}
		});
		return filter;
	}

	function getSortValue($sortForm) {
		const $sortInput = $sortForm.find('#sort');
		if ($sortInput.length === 1) {
			return $sortInput.val().trim();
		}
		return -1;
	}
});
