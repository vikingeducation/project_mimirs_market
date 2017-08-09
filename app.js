var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["asdf1234567890qwer"]
  })
);

const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);
app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});
app.use(express.static(`${__dirname}/public`));
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);
app.use(morgan("tiny"));
app.use(morganToolkit());

const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// build routes here

app.get("/", (req, res) => {
  res.end("working");
});

var expressHandlebars = require("express-handlebars");
var hbs = expressHandlebars.create({
  partialsDir: "views/partials",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
