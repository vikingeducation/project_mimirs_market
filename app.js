//Express app
const express = require("express");
const app = express();

//Modules
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/partials",
  defaultLayout: "application"
});

//Custom middleware modules
const mdw = require("./lib/middleware");

//Database models
const { Product } = require("./models/sequelize");

//Routers
const productsRouter = require("./routers/products");
const cartRouter = require("./routers/cart");
const checkoutRouter = require("./routers/checkout");

//View engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//Middleware from modules
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(morgan("tiny"));
app.use(morganToolkit());
app.use(
  cookieSession({
    name: "session",
    keys: ["asdfqwerfdsarewq"]
  })
);
app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);

//Initial redirect
app.get("/", (req, res) => {
  return res.redirect("/products");
});

//Middleware from files
app.use(mdw.setBackUrl);
app.use(mdw.mongooseReady);
app.use(mdw.retainSortField);
app.use(mdw.cartFiller);

//Routes
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);

//Set up and start server
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});
app.listen.apply(app, args);

module.exports = app;
