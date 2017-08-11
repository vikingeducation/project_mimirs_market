const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
const models = require("./../../models/mongoose");
const faker = require("faker");

const mongodbUrl = "mongodb://localhost/project_mimirs_market_development";

mongooseeder.seed({
	mongodbUrl: mongodbUrl,
	models: models,
	clean: true,
	mongoose: mongoose,
	seeds: () => {
		// Run your seeds here
		let orders = [];
		for (let i = 0; i < 10; i++) {
			order = {
				customer: {
					fname: faker.name.firstName(),
					lname: faker.name.lastName(),
					email: faker.internet.email(),
					address: {
						street: faker.address.streetName(),
						city: faker.address.city(),
						state: faker.address.state()
					}
				},
				products: [],
				description: faker.lorem.words(),
				total: 0,
				token: `tok_XXXXXXXXXXXXX${i}`,
				card: "Visa"
			};

			for (let j = 1; j < 6; j++) {
				product = {
					id: j,
					sku: `FKP12345N${i}`,
					name: faker.commerce.productName(),
					imagePath: `image_${i % 10}.jpg`,
					description: faker.lorem.sentences(),
					price: faker.commerce.price(),
					categoryId: Math.floor(Math.random() * 10 + 1)
				};

				order.total += Number(product.price);
				order.products.push(product);
			}
			orders.push(order);
		}
		// Example:
		return models.Order.create(orders);
	}
});
