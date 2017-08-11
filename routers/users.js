const express = require("express");
const router = express.Router();
const models = require("../models");
const { User } = models;
const sequelize = models.sequelize;
const helpers = require("../helpers");

router.get("/:id", (req, res) => {
  console.log("adadfasdf");
  let sessionId = req.session.id;
  let userId = req.params.id;
  User.find({ where: { id: userId } })
    .then(result => {
      console.log(req.session);
      console.log(req.params);
      if (result.id) {
        if (sessionId == userId) {
          return res.render(`users/myPage`, { user: result });
        } else {
          return res.render(`users/notMyPage`, { user: result });
        }
      } else {
        res.redirect("/users");
      }
    })
    .catch(e => {
      res.status(500).send(e.stack);
    });
});

router.post("/login", (req, res) => {
  let userParams = { username: req.body.username, email: req.params.email };

  return User.findOrCreate({
    defaults: userParams,
    where: { username: req.body.username }
  })
    .spread((result, created) => {
      console.log("before");
      console.log(result, created);
      console.log("after");
      if (!created) req.flash("notice", "Logged in successfully!");
      else req.flash("notice", "Created account successfully!");

      User.update(
        { loggedIn: true },
        { where: { id: result.id }, limit: 1 }
      ).then(() => {
        req.session.id = result.id;
        res.redirect(helpers.userPath(result.id));
      });
    })
    .catch(e => {
      console.log(e.stack);
      res.status(500).send(e.stack);
    });
});

router.get("/logout", (res, req) => {
  let sessionId = req.session.id;
  if (sessionId) {
    User.update(
      { loggedIn: false },
      { where: { id: sessionId }, limit: 1 }
    ).then(() => {
      res.redirect("/");
    });
  }
});

module.exports = router;
