var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
var sequelize = models.sequelize;
var { Product, Category } = models;

// ----------------------------------------
// Index
// ----------------------------------------
var onIndex = (req, res) => {
  Product.findAll({
    include: [
      {
        all: true
      }
    ]
  })
    .then(products => {
      console.log(products);
      res.render("products/index", { products });
    })
    .catch(e => res.status(500).send(e.stack));
};
router.get("/", onIndex);
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
