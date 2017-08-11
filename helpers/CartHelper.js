module.exports = {
  cartPath: () => "/cart/",
  newCartPath: id => `/cart/${id}`,
  editCartPath: id => `/cart/${id}`,
  destroyCartPath: id => `/cart/${id}?_method=delete`,
  destroyCartsPath: () => "/cart?_method=delete",
  checkoutPath: () => "/cart/checkout",
  prettyPrice: price => {
    if (isNaN(price)) throw "Not a number";
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  }
};
