const mongoose = require("mongoose");
const { Product, Category } = require("../models/sequelize");

const mdw = {
  //set redirect to "/" unless referer
  setBackUrl: (req, res, next) => {
    req.session.backUrl = req.header("Referer") || "/";
    next();
  },

  //check mongoose connection, reconnect if needed
  mongooseReady: (req, res, next) => {
    if (mongoose.connection.readyState) {
      next();
    } else {
      require("../mongo")().then(() => next());
    }
  },

  //retain sort option input field (negated on some routes)
  retainSortField: (req, res, next) => {
    res.cookie("selectedSortOption", "id-ASC");
    next();
  },

  // hoist cart if needed, find items,
  // make available to view engine, hoist inCart object
  cartFiller: (req, res, next) => {
    let total = 0;
    req.session.cart = req.session.cart || [];
    let cart = req.session.cart.map(i => i.id);
    Product.findAll({
      where: { id: { $in: cart } },
      include: [{ all: true, nested: true }]
    })
      .then(r => {
        r.forEach((p, pix) => {
          req.session.cart.forEach((i, cix) => {
            if (p.id * 1 === i.id * 1) {
              p.quantity = i.quantity;
              total += i.quantity * p.price;
            }
          });
        });
        return r;
      })
      .then(r => {
        res.locals.items = r;
        res.locals.total = total;
        res.locals.inCart = true;
        next();
      });
  }
};

module.exports = mdw;
