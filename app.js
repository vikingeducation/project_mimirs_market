const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

// Allows us to use partials???

app.set("view engine", "handlebars");
const hbs = exphbs.create({ defaultLayout: "application" });
app.engine("handlebars", hbs.engine);

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("listening at " + port);
});
