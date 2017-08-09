var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
const Product = models.Product

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  Product.find({})
    .then(products => {
      res.render("products/index", { products });
    })
    .catch(e => res.status(500).send(e.stack));
});

// ----------------------------------------
// Add
// ----------------------------------------
// router.get("/add", (req, res) => {
//   res.render("users/new");
// });


// ----------------------------------------
// Show
// ----------------------------------------
// router.get("/:id", (req, res) => {
//   User.findById(req.params.id)
//     .then(user => {
//       res.render("users/show", { user });
//     })
//     .catch(e => res.status(500).send(e.stack));
// });



module.exports = router;
