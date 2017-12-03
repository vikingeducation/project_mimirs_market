const { hbs } = require('../app');
const models = require('../models/sequelize');
const { Product } = models;

var Socket = {};

Socket.setup = (io) => {
  io.on('connection', client => {
    console.log('socket connected');

    client.on('addToCart', cartData => {
      const cart = cartData.cart ? JSON.parse(cartData.cart) : {};

      Product.findById(cartData.productId)
        .then(product => {
          cart[product.id] = { name: product.name, quantity: 1 };
          cartData.itemCount = Object.keys(cart).length;
          const cartCookie = JSON.stringify(cart);
          cartData.cart = cartCookie;

          return hbs.render('views/shared/_nav.hbs', { cart });
        })
        .then(navPartial => {
          client.emit('newCartItem', cartData, navPartial);
        });
    });

  });
};

module.exports = Socket;
