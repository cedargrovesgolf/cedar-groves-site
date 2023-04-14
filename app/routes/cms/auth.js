/* ./routes/cms/auth.js */
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();

router.post('/', function (req, res) {
  const storedUser = process.env.USER;
  const storedHash = process.env.PASS_HASH;

  let username = req.body.username;
  let password = req.body.password;
  let hash = crypto.createHash('sha256').update(password).digest('hex');

  if (hash === storedHash && username === storedUser) {
    req.session.loggedin = true;
    req.session.username = username;
  } else {
    res.cookie('failedLogIn', true);
  }
  res.redirect('/admin-cms')
  res.end();
});

module.exports = router;