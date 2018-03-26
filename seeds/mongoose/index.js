var faker = require("faker");

// mongoose
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const models = require("./../../models/mongoose");
var env = process.env.NODE_ENV || "development";
var config = require("./../../config/mongoose")[env];
const mongooseeder = require("mongooseeder");
const { Order } = models;

// sequelize
const seqeulize = require("sequelize");
var seqeulizeModels = require("./../../models/sequelize");
var sequelize = seqeulizeModels.sequelize;
var Products = seqeulizeModels.Products;
var Categories = seqeulizeModels.Categories;

const MULTIPLIER = 1;

function randomId() {
	return Math.floor(Math.random() * 200);
}

function getProduct(productId, i) {
	return Products.findOne({
		include: [{ model: Categories }],
		where: { id: productId }
	}).then((err, product) => {
		if (err) console.error(err);
		if (product) {
			product.quantity = i % 8;
		}
		return product;
	});
}

const seeds = () => {
	// ----------------------------------------
	// Create Oders
	// ----------------------------------------
	console.log("Creating Orders");
	var orders = [];
	for (let i = 1; i < 222; i++) {
		var productId = randomId();

		return new Promise(function(resolve, reject) {
			getProduct(productId, i)
				.then(product => {
					var order = new Order({
						fname: faker.name.firstName(),
						lname: faker.name.lastName(),
						address: faker.address.streetAddress(),
						city: faker.address.city(),
						state: faker.address.state(),
						zip: faker.address.zipCode(),
						total: i * 86,
						orderedProducts: [product],
						stripe: {
							transfer_group: null,
							status: "succeeded",
							statement_descriptor: null,
							source_transfer: null,
							source: {
								tokenization_method: null,
								name: faker.internet.email(),
								last4: "4242",
								funding: "credit",
								fingerprint: "CnRCuVZss2LTEKEz",
								exp_year: 2018,
								exp_month: 1,
								dynamic_last4: null,
								cvc_check: "pass",
								customer: null,
								country: "US",
								brand: "Visa",
								address_zip_check: null,
								address_zip: null,
								address_state: null,
								address_line2: null,
								address_line1_check: null,
								address_line1: null,
								address_country: null,
								address_city: null,
								object: "card",
								id: "card_1BQirYGRxzsP4XGrMXaJ7W99"
							},
							shipping: null,
							review: null,
							refunds: {
								url: "/v1/charges/ch_1BQirbGRxzsP4XGrdb1m7o6r/refunds",
								total_count: 0,
								has_more: false,
								data: [],
								object: "list"
							},
							refunded: false,
							receipt_number: null,
							receipt_email: null,
							paid: true,
							outcome: {
								type: "authorized",
								seller_message: "Payment complete.",
								risk_level: "normal",
								reason: null,
								network_status: "approved_by_network"
							},
							order: null,
							on_behalf_of: null,
							livemode: false,
							invoice: null,
							failure_message: null,
							failure_code: null,
							dispute: null,
							destination: null,
							description: "Refined Rubber Hat",
							customer: null,
							currency: "usd",
							created: 1511298063,
							captured: true,
							balance_transaction: "txn_1BQirbGRxzsP4XGrDiJ1MSv5",
							application_fee: null,
							application: null,
							amount_refunded: 0,
							amount: i * 86,
							object: "charge",
							id: "ch_1BQirbGRxzsP4XGrdb1m7o6r"
						},
						stripeToken: faker.random.uuid()
					});

					resolve(orders.push(order));
				})
				.catch(error => {
					console.error(error);
					reject(error);
				});
		});
	}

	// ----------------------------------------
	// Finish
	// ----------------------------------------

	var promises = [];

	console.log("Saving...");

	orders.forEach(model => {
		promises.push(model.save());
	});

	return Promise.all(promises);
};

// Always use the MongoDB URL to allow
// easy connection in all environments
const mongodbUrl =
	process.env.NODE_ENV === "production"
		? process.env[config.use_env_variable]
		: `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
	mongodbUrl: mongodbUrl,
	seeds: seeds,
	clean: true,
	models: models,
	mongoose: mongoose
});

// mongooseeder.clean({
//   database: config.database,
//   host: config.host,
//   models: models,
//   mongoose: mongoose
// });
