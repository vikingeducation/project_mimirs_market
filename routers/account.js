const express = require("express");
const router = express.Router();
const models = require("../models");
const { User } = models;
const sequelize = models.sequelize;
const helpers = require("../helpers");

router.get("/", (req, res) => {
  console.log("adadfasdf");
  let sessionId = req.session.id;
  if (sessionId === undefined) {
    return res.render(`account/loginPage`);
  } else {
    User.find({ where: { id: sessionId } })
      .then(result => {
        if (result.loggedIn) res.redirect(helpers.userPath(sessionId));
        else res.render("account/loginPage");
      })
      .catch(e => {
        res.status(500).send(e.stack);
      });
  }
});

router.post("/login", (req, res) => {
  let userParams = { username: req.body.username };

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
