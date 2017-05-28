
https://mimir-market.herokuapp.com/

# Mimir's Market

A Viking style eCommerce application complete with shopping carts and checkout.
Project included these steps:
1. Setup your data model and plan your development strategy
2. Integrate Sequelize and Mongoose into a single project
3. Setup the store front to allow searching and viewing products
4. Create a session based shopping cart for your customers to fill
5. Enable checkout with Stripe sandbox payments
6. Create an admin dashboard to view placed orders and analytics

You are able to search for products, add products to the cart, checkout (with test mode Stripe: email: foobar@gmail.com, card Number 4242424242424242, cvs 123, exp.date 1/18), check admin and analytics page for order information and analysis.

## Getting Started

Run npm install before you start. You can run it on your machine by running nodemon app.js or node app.js. You need to have mongoDB and PostgresSQL up and running. You also should run seed files before you start: npm run sql:s and npm run mg:seed. 

## Deployment

https://mimir-market.herokuapp.com/

## Built With

* [Stripe] - for checkouts
* [mongoDB) - database for order information and performing analytics
* [PostgresSQL] - database to store inventory information
* [Node, Express] - server

## Authors

* **Egle Libby** - (https://github.com/eglital)
