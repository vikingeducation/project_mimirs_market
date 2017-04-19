const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;

const { Product, Category } = models;

function _makeQuery(query) {
  if (query.search) {
    const searchQuery = query.search;
    return {
      include: [{ all: true }],
      where: { name: { $iLike: `%${searchQuery}%` } }
    };
  } else if (query.category) {
    let min = query.min || 0;
    let max = query.max || 1000;
    let category = query.category === 'All'
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      : [query.category];
    return {
      include: [{ all: true }],
      where: { price: { $gte: min, $lte: max }, categoryId: { $in: category } }
    };
  } else if (query.sort) {
    let orderParam;
    switch (query.sort) {
      case "price":
        orderParam = "price";
        break;
      case "priceDesc":
        orderParam = "price DESC";
        break;
      case "name":
        orderParam = "name";
        break;
      case "nameDesc":
        orderParam = "name DESC";
        break;
      case "created":
        orderParam = '"createdAt"';
        break;
      case "createdDesc":
        orderParam = '"createdAt" DESC';
        break;
      default:
        orderParam = "";
    }
    return {
      include: [{ all: true }],
      order: orderParam
    };
  } else {
    return {
      include: [{ all: true }]
    }
  }
}

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  const queryObj = _makeQuery(req.query);

  let products;
  Product.findAll(queryObj)
    .then(prod => {
      products = prod;
      return Category.findAll({});
    })
    .then(categories => {
      res.render("products/index", { products, categories });
    })
    .catch(e => res.status(500).send(e.stack));
});

// // ----------------------------------------
// // Search
// // ----------------------------------------
// router.get("/search", (req, res) => {
//   Product.findAll()
//     .then(products => {
//       res.render("products/index", { products });
//     })
//     .catch(e => res.status(500).send(e.stack));
// });
//
// // ----------------------------------------
// // Filter
// // ----------------------------------------
//
// router.get("/filter", (req, res) => {
//   Product.findAll()
//     .then(products => {
//       res.render("products/index", { products });
//     })
//     .catch(e => res.status(500).send(e.stack));
// });
//
// // ----------------------------------------
// // Sort
// // ----------------------------------------
// router.get("/sort", (req, res) => {
//
//
//   Product.findAll()
//     .then(products => {
//       res.render("products/index", { products });
//     })
//     .catch(e => res.status(500).send(e.stack));
// });
//router.get("/users", onIndex);
//
// // ----------------------------------------
// // New
// // ----------------------------------------
// router.get("/users/new", (req, res) => {
//   res.render("users/new");
// });
//
// // ----------------------------------------
// // Edit
// // ----------------------------------------
// router.get("/users/:id/edit", (req, res) => {
//   User.findById(req.params.id)
//     .then(user => {
//       if (user) {
//         res.render("users/edit", { user });
//       } else {
//         res.send(404);
//       }
//     })
//     .catch(e => res.status(500).send(e.stack));
// });
//
// ----------------------------------------
// Show
// ----------------------------------------
router.get("/:id", (req, res) => {
  Product.findById(req.params.id, {
    include: [
      {
        model: Category,
        include: [
          {
            model: Product,
            where: {
              id: { $ne: req.params.id }
            }
          }
        ]
      }
    ]
  })
    .then(product => {
      if (product) {
        res.render("products/show", { product });
      } else {
        res.send(404);
      }
    })
    .catch(e => res.status(500).send(e.stack));
});
//
// // ----------------------------------------
// // Create
// // ----------------------------------------
// router.post("/users", (req, res) => {
//   var body = req.body;
//
//   var userParams = {
//     fname: body.user.fname,
//     lname: body.user.lname,
//     username: body.user.username,
//     email: body.user.email
//   };
//
//   User.create(userParams)
//     .then(user => {
//       res.redirect(`/users/${user.id}`);
//     })
//     .catch(e => res.status(500).send(e.stack));
// });
//
// // ----------------------------------------
// // Update
// // ----------------------------------------
// router.put("/users/:id", (req, res) => {
//   var userParams = req.body.user;
//
//   User.update(
//     {
//       fname: userParams.fname,
//       lname: userParams.lname,
//       username: userParams.username,
//       email: userParams.email
//     },
//     {
//       where: { id: req.params.id },
//       limit: 1
//     }
//   )
//     .then(() => {
//       req.method = "GET";
//       res.redirect(`/users/${req.params.id}`);
//     })
//     .catch(e => res.status(500).send(e.stack));
// });
//
// // ----------------------------------------
// // Destroy
// // ----------------------------------------
// router.delete("/users/:id", (req, res) => {
//   User.destroy({
//     where: { id: req.params.id },
//     limit: 1
//   })
//     .then(() => {
//       req.method = "GET";
//       res.redirect("/users");
//     })
//     .catch(e => res.status(500).send(e.stack));
// });

module.exports = router;
