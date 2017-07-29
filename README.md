# Mimir's Market

[![Mimir's Market](http://i.imgur.com/J8H3xe7.png)](https://nameless-stream-46232.herokuapp.com/)

## Introduction
Mimir's Market is a full-fledged ecommerce website that leverages MongoDB, PostgreSQL, and Stripe to process and save orders.

## Technologies Used
PostgreSQL, MongoDB, Stripe, Node, Express, Async/Await

## Getting Started
First, clone the repository and install dependencies. Then you will need to populate the database with mock product data by running `npm run sql:s`. Then, you will need to register for developer keys from Stripe in order to enable order processing. Once you have the keys, they should be set in environmentable variables as `STRIPE_SK` and `STRIPE_PK`, respectively. Then, you can finally start your app by running `node app.js`.

## Deployment Link
A deployed version of this project may be found [here.](https://nameless-stream-46232.herokuapp.com/)

Use the following sandbox values on checkout in order to save a transaction.

Credit card number: `4242 4242 4242 4242`

Expiration date: `1/18`

CVC: `123`

## Additional Notes
The cart is managed completely using sessions in the back-end. All product data is stored in the Postgres database. After an order has been successfully confirmed, the details of the transaction are saved to MongoDB. This data is then made available in the analytics tab of the website. 

An interesting file to note is `analytics-helpers.js` in the helpers folder. The helper methods in this file use ES7 async/await to conveniently parse and package all the raw analytic data saved in MongoDB. 
