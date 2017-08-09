const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const session = require("express-session");
const sqlModels = require("./models/sequelize");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

const hbs = exphbs.create({
	partialsDir: "views/partials",
	defaultLayout: "main"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(
	session({
		secret: "123456",
		resave: false,
		saveUninitialized: true
	})
);

app.get("/", (req, res) => {
	sqlModels.Product
		.findAll({
			include: [
				{
					model: sqlModels.Category
				}
			]
		})
		.then(products => {
			console.log(products[0]);
			res.render("index", { products });
		});
});

app.listen(3000, () => {
	console.log("Now listening...");
});
