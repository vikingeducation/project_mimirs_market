const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;

const { Product, Category } = models;

router.get("/", (req, res) => {
  res.render("cart/index");
});

module.exports = router;
