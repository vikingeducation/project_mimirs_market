const defaults = {
  name: '',
  minPrice: 0,
  maxPrice: 1000,
  category: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

const formatSearch = search => {
  let formattedSearch = {};

  if (search) {
    formattedSearch = search;
  } else {
    formattedSearch = {
      name: '',
      minPrice: '',
      maxPrice: '',
      category: ''
    };
  }

  formattedSearch.name = formattedSearch.name || '';
  formattedSearch.minPrice = formattedSearch.minPrice || defaults.minPrice;
  formattedSearch.maxPrice = formattedSearch.maxPrice || defaults.maxPrice;

  return formattedSearch;
};

const getSearchParams = search => {
  let searchParams = {};
  let category;

  searchParams.name = {
    $iLike: `%${search.name}%`
  };

  searchParams.price = {
    $between: [search.minPrice, search.maxPrice]
  };

  if (search.category === '' || typeof search.category === 'undefined') {
    category = defaults.category;
  } else {
    category = [search.category];
  }

  searchParams.categoryId = {
    $in: category
  };

  return searchParams;
};

const formatSortParams = sortStr => {
  const sortParams = sortStr.split(' ');
  let sort = {};

  sort.string = sortStr;
  sort.array = [[sortParams[0], sortParams[1]]];

  return sort;
};

module.exports = { formatSearch, getSearchParams, formatSortParams };
