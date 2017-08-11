const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const sequelize = models.sequelize;
const helpers = require("../helpers");

var categoryArray = [];
Category.findAll({ attributes: ["name"] })
  .then(result => {
    result.forEach(i => {
      if (i.name != null) categoryArray.push(i.name);
    });
    //categoryArray = categoryArray.split(4);
    console.log(categoryArray);
    return categoryArray;
  })
  .catch(e => {
    //  console.log(e);
    console.log("failinghere");
    //  res.status(500).send(e.stack);
  });
router.get("/", (req, res) => {
  Product.findAll()
    .then(result => {
      return res.render(`products/index`, {
        products: result
      });
    })
    .catch(e => {
      res.status(500).send(e.stack);
    });
});
router.get("/:id", (req, res) => {
  console.log("adadfasdf");
  let sessionId = req.session.id;
  let productId = req.params.id;
  Product.find({ where: { id: productId } })
    .then(result => {
      if (result != undefined) {
        return res.render(`products/OneProduct`, {
          product: result,
          category: categoryArray[result.CategoryId]
        });
      } else {
        res.redirect("/products");
      }
    })
    .catch(e => {
      res.status(500).send(e.stack);
    });
});

router.post("/search", (req, res) => {
  let searchparams = {
    name: req.body.name || "",
    category: req.params.category || "",
    minPrice: req.body.minPrice || 0,
    maxPrice: req.body.maxPrice || 1000
  };
  //searchparams.category = categoryArray.indexOf(req.params.category);
  searchparams.name = "%" + searchparams.name + "%";
  Product.findAll({
    where: {
      $and: {
        name: {
          $like: searchparams.name
        },
        price: { $lte: searchparams.maxPrice, $gte: searchparams.minPrice }
      }
    }
  })
    .then(result => {
      return res.render(`products/index`, {
        products: result
      });
    })
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e.stack);
    });
});

module.exports = router;
