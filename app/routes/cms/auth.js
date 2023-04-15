/* ./routes/cms/auth.js */
const express = require('express');
const router = express.Router();
const { getItem } = require('../../helper/dynamo-helper');
const { compareHash } = require('../../helper/hash');

router.post('/', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userQuery = { tableName: 'cedar-groves-cms-users', keyName: 'userID', keyType: 'N', keyValue: '0' };
  const user = await getItem(userQuery);

  if (username === user.username.S && compareHash(password, user.passwordHash.S)) {
    req.session.loggedin = true;
    req.session.username = username;
  } else {
    res.cookie('failedLogIn', true);
  }
  res.redirect('/admin-cms');
  res.end();
});

module.exports = router;