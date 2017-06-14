# project_mimirs_market
A Viking eCommerce store for Thunder Gods that like to buy "Antique Wooden Pizzas"

Name: Christian Florez

Entities:

SQL:
Products
  -name
  -sku (just for realism)
  -description
  -price
  -categoryId

sequelize model:create --name Product --attributes "name:string sku:integer description:text price:decimal categoryId:integer"
sequelize model:create --name Category --attributes "name:string"

Categories
  -name
Session Based Shopping Cart
States (for Checkout Form)

MongoDB
Analytics will need following:
  -Orders index
  -Individual Orders
  -Totals (Units Sold, Transactions, etc.)
  -Revenue by State
  -Revenue by Product
  -Revenue by Category

Order: {
  "_id:" integer,
  "orderDescription": string,
  timestamps,
  "revenue": decimal,
  "stripeToken": string?
  "customer": {
    "fname": string,
    "lname": string,
    "email": string,
  },
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "stateId": string
  },
  "orderLine": [{
    "product": {
      "name": string,
      "price": decimal,
      "quantity": integer,
      "sku": string,
      "description": text,
      "category" string,
    }
  }]
}

Use $unwind for aggregating!