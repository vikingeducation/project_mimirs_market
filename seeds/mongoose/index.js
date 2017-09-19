const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
var env = process.env.NODE_ENV || "development";
const models = require("./../../models/mongoose");
const faker = require("faker");
var config = require("./../../config/mongo")[env];
const { Order, OrderItem } = models;

const mongodbUrl =
	process.env.NODE_ENV === "production"
		? process.env[config.use_env_variable]
		: `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
	mongodbUrl: mongodbUrl,
	models: models,
	clean: true,
	mongoose: mongoose,
	seeds: () => {
		// Run your seeds here
		let orders = [];
		let orderItems = [];
		for (let i = 0; i < 10; i++) {
			let order = new Order({
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
				description: faker.lorem.words(),
				total: 0,
				token: `tok_XXXXXXXXXXXXX${i}`,
				card: "Visa"
			});

			for (let j = 1; j < 4; j++) {
				let orderItem = new OrderItem({
					productId: j,
					sku: `FKP12345N${i}`,
					name: faker.commerce.productName(),
					imagePath: `image_${i % 10}.jpg`,
					description: faker.lorem.sentences(),
					price: faker.commerce.price(),
					categoryId: Math.floor(Math.random() * 10 + 1),
					category: faker.commerce.department(),
					quantity: Math.floor(Math.random() * 5 + 1)
				});

				orderItem.total = orderItem.price * orderItem.quantity;
				order.total += Number(orderItem.total);
				orderItems.push(orderItem);
				order.orderItems.push(orderItem);
			}
			orders.push(order);
		}

		let promises = [];
		[orders, orderItems].forEach(collection => {
			collection.forEach(model => {
				promises.push(model.save());
			});
		});
		return Promise.all(promises);
	}
});
