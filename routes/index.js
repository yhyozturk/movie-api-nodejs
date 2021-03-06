const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Models
const User = require('../models/User');



/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Welcome to Yahya\'s movie api' });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username, password });

  const promise = user.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    username
  }, (err, user) => {
    if (err)
      throw err;

    if (!user) {
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }
    else {
      if (password != user.password) {
        res.json({
          status: false,
          message: 'Authentication failed, wrong password.'
        });
      }
      else {
        const payload = {
          username
        };
        const token = jwt.sign(payload, req.app.get('api_secret_key'), {
          expiresIn: 720 // 12 saat
        });

        res.json({
          status: true,
          token
        });
      }
    }
  });
});


module.exports = router;
