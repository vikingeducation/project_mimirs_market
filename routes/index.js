var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect('/products');


});

module.exports = router;

/*
router.get('/login', function(req, res, next) {
  if (req.session.username) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'Thorredit Login',
    });
  }
});

router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.email) {
    User.findOne({
        username: req.body.username
      })
      .then((login) => {
        // check password value if we were doing passwords :-)
        if (login && (login.email.toUpperCase() === req.body.email.toUpperCase())) {
          req.session._id = login._id;
          req.session.username = login.username;
          req.session.email = login.email;
          res.redirect('/');
        }

      })
      .catch((e) => res.status(500)
        .send(e.stack));
  } else {
    res.redirect('/login');
  }

});

router.get('/logout', function(req, res, next) {
  //  req.session.username = null;
  //  req.session.email = null;
  req.session.destroy(function() {
    res.redirect('/login');
  });

});
*/
