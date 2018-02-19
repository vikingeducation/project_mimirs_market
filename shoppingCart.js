class ShoppingCart {
  constructor() {
    this.products = [];
    
  }

  add(product) {
    this.products.push(product);
  }

  remove(removeId) {
    this.products = products.filter(product => {
      if (product.id !== removeId) return true;
      return false;
    })
  }

  empty() {
    this.products = [];
  }
};

module.exports = ShoppingCart;


