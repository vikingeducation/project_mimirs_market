var express = require("express");
var router = express.Router();
const { Product, Category } = require("../models/sequelize");

//util functions
function getTotal(cart) {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}
let removeFromCart = (cart, itemId) => {
  let newCart = cart.filter(item => {
    return item.id !== Number(itemId);
  });
  return newCart;
};

//show cart route
router.get("/", (req, res) => {
  res.render("cart/show", {
    cart: req.session.cart,
    total: getTotal(req.session.cart)
  });
});

//DELETE all from cart
router.delete("/", (req, res) => {
  req.session.cart = [];
  req.method = "GET";
  res.redirect("/cart");
});

//add an item to Cart
router.post("/add", (req, res) => {
  req.session.cart = req.session.cart || [];
  // req.session.cart = []; //used to refresh the cart
  //get the product
  console.log(`item = ${req.body.addItem}`);
  Product.findAll({
    where: { id: req.body.addItem },
    include: { model: Category }
  }).then(result => {
    console.log(`result = ${result}`);
    let product = result[0];
    //look for matching products already in cart
    let match = req.session.cart.find(item => {
      return item.id === product.id;
    });
    if (match) {
      //if product already in cart add one
      match.quantity++;
    } else {
      //else throw it in cart
      let item = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.Category.name,
        img: product.img,
        quantity: 1
      };
      req.session.cart.push(item);
    }
    return res.redirect("/");
  });
});

//DELETE an item from cart
router.delete("/:id", (req, res) => {
  req.session.cart = removeFromCart(req.session.cart, req.params.id);
  req.method = "GET";
  res.redirect("/cart");
});

//Update Quantity on an Item
router.post("/:id", (req, res) => {
  if (req.body.quantity <= 0) {
    //remove the item from cart
    req.session.cart = removeFromCart(req.session.cart, req.params.id);
  }
  req.session.cart.forEach(item => {
    if (item.id === Number(req.params.id)) {
      item.quantity = req.body.quantity;
    }
  });
  req.method = "GET";
  res.redirect("/cart");
});

module.exports = router;
