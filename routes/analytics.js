const express = require("express");
const router = express.Router();
var getDbInfo = require("./../lib/dbInfo");

router.get("/", (req, res) => {
  let cartProducts = req.session.cartProducts;
  let promiseArr = getDbInfo();

  Promise.all(promiseArr)
    .then(result => {
      let totals = {
        totalRevenue: result[0][0].totalRevenue,
        totalUnitsEver: result[0][0].totalUnitsEver,
        totalTransactions: result[0][0].totalTransactions,
        totalUsers: result[1][0].totalUsers,
        totalProducts: result[2],
        totalCategories: result[3],
        totalStates: result[4][0].totalStates,
        totalStatesRevenue: result[5],
        totalCategoriesRevenue: result[6],
        totalProductsRevenue: result[7]
      };

      res.render("analytics/index", { totals, cartProducts });
    })
    .catch(() => res.status(500).send(e.stack));
});

module.exports = router;
