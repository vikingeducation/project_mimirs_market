const defaults = {
  name: '',
  minPrice: 0,
  maxPrice: 1000,
  category: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

const formatSearchParams = search => {
  const name = search.name || defaults.name;
  const minPrice = search.minPrice || defaults.minPrice;
  const maxPrice = search.maxPrice || defaults.maxPrice;

  let category;
  if (typeof search.category === 'undefined') {
    category = defaults.category;
  } else {
    category = [search.category];
  }

  let searchParams = {};

  searchParams.name = {
    $iLike: `%${name}%`
  };

  searchParams.price = {
    $between: [minPrice, maxPrice]
  };

  searchParams.categoryId = {
    $in: category
  };
  let sort = {};
  if (typeof search.sort === 'undefined') {
    sort.string = 'name ASC';
    sort.array = [['name', 'ASC']];
  } else {
    sort.string = search.sort;
    const sortParams = search.sort.split(' ');
    sort.array = [[sortParams[0], sortParams[1]]];
  }

  return {
    searchParams,
    sort
  };
};

const formatSortParams = sortStr => {
  let sort = {};
  console.log(sortStr);

  if (typeof sortStr === 'undefined') {
    sort.string = 'name ASC';
    sort.array = [['name', 'ASC']];
  } else {
    sort.string = sortStr;
    const sortParams = sortStr.split(' ');
    sort.array = [[sortParams[0], sortParams[1]]];
  }
};

module.exports = { formatSearchParams, formatSortParams };
