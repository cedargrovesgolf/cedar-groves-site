/* ./routes/cms/admin-cms.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var failedLogIn = req.cookies['failedLogIn'];
  res.clearCookie('failedLogIn');

  var loggedIn = req.session.loggedin;
  var body;

  if (loggedIn) {
    var username = req.session.username;
    body = {
      'failedLogIn': false,
      'loggedIn': loggedIn,
      'user': username
    };

  } else {
    body = { 'loggedIn': false, 'failedLogIn': failedLogIn };
  }
  // render the page
  res.render('admin-cms', body);
});

module.exports = router;