var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const models = require('./../models/sequelize');
const Orders = models.order;
const Sales = models.sale;
const mongoose = require('mongoose');
const Categories = mongoose.model('Category');
const sequelize = models.sequelize;

router.get('/', (req, res, next) => {
  res.render('adminlogin');
});

router.post('/', (req, res, next) => {
  bcrypt.compare(req.body.pass, process.env.ADMIN_HASH)
    .then(result =>{
      if(result && req.body.name == process.env.ADMIN_NAME){
        bcrypt.hash('authenticated', 8)
          .then( hash => {
            req.session.admin = hash;
            res.redirect('/admin/main')
          });
      } else {
        res.redirect('/');
      }
    })
    .catch(e => {
      res.status(500).send(e.stack);
    });
});

router.get('/main', (req, res, next) => {
  let sessionString = req.session.admin || 'fail';
  bcrypt.compare('authenticated', sessionString)
    .then(async result => {
      if(result){
        try{
          let categories = await Categories.find();
          let sales = await Sales.findAll();
          let orders = await Orders.findAll();
          let totalRevenue = 0;
          let orderArray = [];
          orders.forEach(order => {
            totalRevenue += order.order_total;
            orderArray.push([order.id, order.order_total, order.card_brand, order.state, order.createdAt.toString().substring(4,15)]);
          });
          let salesObject = {};
          sales.forEach(sale => {
            if(!salesObject[sale.category]){
              salesObject[sale.category] = 0;
            }
            salesObject[sale.category] += sale.price * sale.quantity;
          })
          let categoriesArray = [];
          categories.forEach(category => {
            categoriesArray.push([category.name, salesObject[category._id] || '0']);
          });
          res.render('adminview', {orders:orderArray, categories:categoriesArray, totalRevenue});
        } catch(e) {
          res.status(500).send(e.stack);
        }
      }else{
        res.redirect('/');
      }
    })
    .catch(e => {
      res.status(500).send(e.stack);
    });
});

module.exports = router;
