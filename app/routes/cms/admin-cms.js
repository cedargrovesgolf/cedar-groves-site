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
      updateSuccess: null,
      updateError: null
    };
  } else {
    body = { loggedIn: false, failedLogIn: failedLogIn };
  }

  const success = req.query.success;
  body.updateSuccess = success === '1' ? 'Content successfully updated!' : null;
  body.updateError =
    success === '0'
      ? 'An error occurred while updating the hours.'
      : success === '-1'
      ? 'Content incomplete. At least one field must be filled out.'
      : null;

  // render the page
  res.render('admin-cms', body);
});

module.exports = router;
