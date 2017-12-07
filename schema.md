sequelize model:create --name Product  --attributes "name:string sku:string description:string price:decimal categoryId:integer"
sequelize model:create --name Category --attributes "name:string"
sequelize model:create --name State --attributes "name:string"

sequelize seed:create --name products
sequelize seed:create --name categories
sequelize seed:create --name states

sequelize db:seed:all

sequelize db:seed:undo:all

npm run c
npm start