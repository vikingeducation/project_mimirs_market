const express = require("express");
const router = express.Router();
var getDbInfo = require("./../lib/dbInfo");

router.get("/", (req, res) => {
  let cartProducts = req.session.shoppingCart;
  getDbInfo().then(totals => {
    res.render("analytics/index", { totals, cartProducts });
  });
});

module.exports = router;
