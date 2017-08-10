var express = require("express");
var router = express.Router();

//show cart route
router.get("/", (req, res) => {
  res.render("cart/show", {
    cart: [{ name: "thign" }, { name: "thign" }]
  });
});

//add to Cart
router.post("/add", (req, res) => {
  req.session.cart = req.session.cart || [];
  //option 1
  //should the cart contain all the data ?
  // req.session.cart.push(req.body.addItem);

  //option 2, store whole item
  //get the product
  Product.findAll({
    where: { id: req.body.addItem }
  }).then(item => {
    req.session.cart.push(item);
    console.log(`back = ${req.session.backUrl}`);
    res.redirect("/");
  });
});
//delete one from cart

//delete all from cart

module.exports = router;
