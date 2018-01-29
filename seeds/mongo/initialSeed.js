var mongoose = require('mongoose');
var models = require('../../models/mongoose');
var Category = models.Category;
var Products = models.Product;

const seedFunc = () => {
  require('../../mongo')().then(async ()=> {
  let categoryArray = [];
  for (let i = 0; i < 10; i++) {
    let currentCat = new Category();
    currentCat.name = `Category ${i + 1}`;
    try {
      await currentCat.save();
    } catch (e) {
      console.error(e);
    }
    categoryArray.push(currentCat);
  }
  for(let i=0; i < 50; i++){
    let currentProd = new Products();
    currentProd.name = `Product ${i + 1}`;
    currentProd.categoryId = categoryArray[Math.floor(i / 5)].id;
    currentProd.price = i;
    currentProd.stock = 10;
    currentProd.description = "Arcu. Quisque molestie pulvinar sem. Nulla magna neque, ullamcorper tempus, luctus eget."
    try{
      await currentProd.save();
    } catch(e) {
      console.error(e);
    }
  }
  })
    .catch(e => {
      console.error(e);
    });
};

seedFunc();
