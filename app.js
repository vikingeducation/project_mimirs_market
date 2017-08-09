const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

app.get("/", (res, req) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("listening at " + port);
});
