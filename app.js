// sequelize model:create --name Products --attributes "name:string sku:string description:string price:integer categoryId:integer"
// sequelize model:create --name Categories --attributes "name:string"
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

var express = require("express");
var app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
var cookieSession = require("cookie-session");

app.use(
	cookieSession({
		name: "session",
		keys: ["asdf1234567890qwer"]
	})
);

app.use((req, res, next) => {
	req.session.cart = req.session.cart || [];
	res.locals.session = req.session;
	res.locals.cart = req.session.cart;

	var cart = req.session.cart;
	cart.quantity = cart.length;
	next();
});

// ----------------------------------------
// Flash messages
// ----------------------------------------

var flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
	methodOverride(
		getPostSupport.callback,
		getPostSupport.options // { methods: ['POST', 'GET'] }
	)
);

// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
	req.session.backUrl = req.header("Referer") || "/";
	next();
});

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

// ----------------------------------------
// Routes
// ----------------------------------------
var productsRouter = require("./routers/products");
app.use("/", productsRouter);

var cartRouter = require("./routers/cart");
app.use("/", cartRouter);

var checkoutRouter = require("./routers/checkout");
app.use("/", checkoutRouter);

var adminRouter = require("./routers/admin");
app.use("/", adminRouter);

// ----------------------------------------
// Template Engine
// ----------------------------------------
var expressHandlebars = require("express-handlebars");

var hbs = expressHandlebars.create({
	partialsDir: "views/",
	defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Server
// ----------------------------------------
var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
	console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
