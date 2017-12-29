var express = require('express');
var router = express.Router();

const models = require('./../models/sequelize');
const Category = models.Category;
const Product = models.Product;

const showcaser = require('./../ProductShowcaser.js');
let queryConstructor = showcaser.queryConstructor;
let objectify = showcaser.objectify;

router.get('/:id', async (req, res, next) => {
  let primaryId = req.params.id;

  let primaryItem = objectify(await Product.findById(primaryId, {
    include: [{ model: Category } ]
  }));
  
  let primaryCategory = primaryItem.category;
  let relatedItems = await Product.findAll({
    include: [
      { 
        model: Category,
        where: {
          name: primaryCategory
        }
      }
    ]
  });
  relatedItems = relatedItems.map(item => objectify(item));
  res.render('welcome/product_display', {primaryItem, relatedItems});
});

module.exports = router;
