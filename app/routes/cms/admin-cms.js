/* ./routes/cms/admin-cms.js */
const express = require('express');
const router = express.Router();
const { getItem } = require('../../helper/dynamo-helper');

router.get('/', async (req, res) => {
  const failedLogIn = req.cookies['failedLogIn'];
  res.clearCookie('failedLogIn');

  const loggedIn = req.session.loggedin;
  let body;

  const baseQuery = {
    tableName: 'cedar-groves-hours',
    keyName: 'type',
    keyType: 'S'
  };
  const openHour = await getItem({ ...baseQuery, keyValue: 'open' });
  const closeHour = await getItem({ ...baseQuery, keyValue: 'close' });
  const overrideMsg = await getItem({ ...baseQuery, keyValue: 'override' });

  if (loggedIn) {
    const username = req.session.username;
    body = {
      failedLogIn: false,
      loggedIn: loggedIn,
      user: username,
      openHour: openHour.hour.S,
      closeHour: closeHour.hour.S,
      overrideMsg: overrideMsg.hour.S,
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
