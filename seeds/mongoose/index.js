const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
const models = require("./../../models/mongoose");

const mongodbUrl = "mongodb://localhost/your_db";

mongooseeder.seed({
	mongodbUrl: mongodbUrl,
	models: models,
	clean: true,
	mongoose: mongoose,
	seeds: () => {
		// Run your seeds here
		let email = [];
		for (let i = 0; i < 10; i++) {
			email.push({ email: `${i}@${i}.com` });
		}
		// Example:
		return models.User.create({ email });
	}
});
