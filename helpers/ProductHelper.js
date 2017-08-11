function selectProduct(product, count) {
  if (count) {
    product["selected"] = true;
    product["count"] = count;
  }
  return product;
}

const ProductHelper = {
  productsPath: () => "/products/",
  productPath: id => `/products/${id}`,
  productCart: (product, cart) => {
    product.Category.Products = ProductHelper.productsCart(
      product.Category.Products,
      cart
    );
    return selectProduct(product, cart[product.id]);
  },
  productsCart: (products, cart) => {
    return products.map(product => {
      return selectProduct(product, cart[product.id]);
    });
  }
};

module.exports = ProductHelper;
