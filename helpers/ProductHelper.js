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
    if (cart) {
      product.Category.Products = ProductHelper.productsCart(
        product.Category.Products,
        cart
      );
      if (cart[product.id]) {
        return selectProduct(product, cart[product.id].count);
      } else {
        return product;
      }
    } else {
      return product;
    }
  },

  productsCart: (products, cart) => {
    if (cart) {
      return products.map(product => {
        if (cart[product.id]) {
          return selectProduct(product, cart[product.id].count);
        } else {
          return product;
        }
      });
    } else {
      return products;
    }
  }
};

module.exports = ProductHelper;
