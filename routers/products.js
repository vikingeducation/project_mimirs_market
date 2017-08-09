var express = require("express");
var router = express.Router();

Router.get("/", () => {
  //get products --> then
  res.render("products/index");
});

module.exports = router;
