# project_mimirs_market
---
A collaboration between: Gene Tinderholm and Lakshmi Maduri

This README covers basic functionality for [Mimir's Market](https://github.com/GeneTinderholm/project_mimirs_market).

1. Clone this repo. To do this, from the terminal run:

    git clone https://github.com/GeneTinderholm/project_mimirs_market

2. Install the required module dependencies. To do this, from the terminal run:

    npm i

3. Install postgres/mongodb if you have not yet.

4. Create the SQL database, for postgres this is going to involve running:

    createdb project_mimirs_market_development

5. To seed the product and category databases (mongodb) run the seed file (note: the command below assumes you are in the main project folder):

    node seeds/mongo/initialSeed.js 

6. Get a [Stripe](https://stripe.com/) api key. This will need to go in a .env file in the main project folder. The variable names are "PUBLIC_KEY" and "PRIVATE_KEY"

7. Add the admin username and a bcrypt hash of the password you would like in the .env file as well. The variable names are "ADMIN_NAME" and "ADMIN_HASH"

8. Start the project, either:

    npm start

or

    node bin/www

should start the project, listening on port 3000.

8. Navigate to [http://localhost:3000](http://localhost:3000) in your browser. You should be greeted with the following page:

![Main Page](https://raw.githubusercontent.com/GeneTinderholm/project_mimirs_market/master/images/main.png)

Clicking on a product name will bring you to a page for the individual product, it should look something like:

![Individual Product](https://raw.githubusercontent.com/GeneTinderholm/project_mimirs_market/master/images/individual.png)

Clicking any of the add to cart buttons or the cart icon in the top-right corner to go to the cart page, if you have already added something to your cart, it should look something like: 

![Cart](https://raw.githubusercontent.com/GeneTinderholm/project_mimirs_market/master/images/cart.png)https://raw.githubusercontent.com/GeneTinderholm/project_mimirs_market/master/images/cart.png

Changing the values in the text input fields and clicking the update quantity button will change the quantity in your cart.

Click the checkout button to go to the checkout page. It should look something like:

![Checkout](https://raw.githubusercontent.com/GeneTinderholm/project_mimirs_market/master/images/checkout.png)

Fill out the information and click the pay with card button. This should open up the Stripe window. A way to test this functionality is with a stripe test card number. Putting 4242 4242 4242 4242 in the credit card number field, any date in the future for the expiration date, and any three digit number in the cvv field should work without actually charging anybody.

Once the order has been made you will be re-directed to the main page. To view past orders go to the admin page. This is a hidden page, there is not a link anywhere. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to view this page. You will be greeted with a login page. Input the username and password that you specified in your .env file.

You should be greeted with the following page:

![Admin Page](https://raw.githubusercontent.com/GeneTinderholm/project_mimirs_market/master/images/admin.png)

On top is a table of past orders. On the bottom is the total revenue of the site and another table breaking down revenue by product category.
