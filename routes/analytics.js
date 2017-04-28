const express = require("express");
const router = express.Router();

const analytics = require("../lib/analytics");

router.get('/', (req, res, next) => {
  analytics.getAll()
    .then(data => res.render('analytics/index', { data }))
    .catch(next);
});

module.exports = router;
