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

  if (
    formattedSearch.category === '' ||
    typeof formattedSearch.category === 'undefined'
  ) {
    formattedSearch.category = defaults.category;
  } else {
    formattedSearch.category = [formattedSearch.category];
  }

  return formattedSearch;
};

const getSearchParams = search => {
  let searchParams = {};

  searchParams.name = {
    $iLike: `%${search.name}%`
  };

  searchParams.price = {
    $between: [search.minPrice, search.maxPrice]
  };

  searchParams.categoryId = {
    $in: search.category
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
