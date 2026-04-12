/* ./routes/cms/admin-cms.js */
const express = require('express');
const router = express.Router();
const { getItem } = require('../../helper/dynamo-helper');
const { getRates, getMemberships, getSeasonYear } = require('../../helper/config-helper');

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

  const [openHour, closeHour, overrideMsg, rates, memberships, seasonYear] =
    await Promise.all([
      getItem({ ...baseQuery, keyValue: 'open' }),
      getItem({ ...baseQuery, keyValue: 'close' }),
      getItem({ ...baseQuery, keyValue: 'override' }),
      getRates(),
      getMemberships(),
      getSeasonYear()
    ]);

  if (loggedIn) {
    const username = req.session.username;
    body = {
      failedLogIn: false,
      loggedIn: loggedIn,
      user: username,
      openHour: openHour.hour.S,
      closeHour: closeHour.hour.S,
      overrideMsg: overrideMsg.hour.S,
      rates: rates || {},
      memberships: memberships || {},
      seasonYear: seasonYear || '',
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
