const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sessionBuilder = require("./../lib/sessionBuilder");

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  let cartItems = sessionBuilder(req.session.cart);
  let length = cartItems.length;
  models.Product
    .findById(id, {
      include: [
        {
          model: models.Category
        }
      ]
    })
    .then(product => {
      models.Product
        .findAll({
          where: { categoryId: product.categoryId, id: { $ne: product.id } },
          limit: 6,
          include: [
            {
              model: models.Category
            }
          ]
        })
        .then(relatedProducts => {
          res.render("product", {
            product,
            relatedProducts,
            cartItems,
            length
          });
        });
    });
});

module.exports = router;
