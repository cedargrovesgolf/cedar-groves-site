/* ./routes/cms/admin-cms.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  const failedLogIn = req.cookies['failedLogIn'];
  res.clearCookie('failedLogIn');

  const loggedIn = req.session.loggedin;
  let body;

  if (loggedIn) {
    const username = req.session.username;
    body = {
      failedLogIn: false,
      loggedIn: loggedIn,
      user: username,
      updateSuccess: req.session.updateSuccess ?? null,
      updateError: req.session.updateError ?? null
    };
    delete req.session.updateSuccess;
    delete req.session.updateError;
  } else {
    body = { loggedIn: false, failedLogIn: failedLogIn };
  }
  // render the page
  res.render('admin-cms', body);
});

module.exports = router;
