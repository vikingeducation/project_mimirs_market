// Setting up Express
const express = require("express");
const app = express();

// Setting up body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up express-handlebars
const exphbs = require("express-handlebars");
app.set("view engine", "handlebars");
const hbs = exphbs.create({ defaultLayout: "application" });
app.engine("handlebars", hbs.engine);
app.use(express.static(`${__dirname}/public`));

// Setting up Cookie session
var cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentUser = req.session.currentUser;
  next();
})

// Passing our routes
const productsRoutes = require("./routers/products");
app.use("/products", productsRoutes);

// Setting up port
var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";
app.listen(port, () => {
  console.log("listening at " + port);
});
