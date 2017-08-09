const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  models.Product.findById(id).then(product => {
    res.render("product", { product });
  });
});

module.exports = router;
