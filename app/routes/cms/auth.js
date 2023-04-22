/* ./routes/cms/auth.js */
const express = require('express');
const router = express.Router();
const { getItem } = require('../../helper/dynamo-helper');
const { compareHash } = require('../../helper/hash');

router.post('/', async (req, res) => {
  const { username, password, rememberMe } = req.body;

  const userQuery = {
    tableName: 'cedar-groves-cms-users',
    keyName: 'userID',
    keyType: 'N',
    keyValue: '0'
  };
  const user = await getItem(userQuery);

  if (
    username === user.username.S &&
    compareHash(password, user.passwordHash.S)
  ) {
    req.session.loggedin = true;
    req.session.username = username;

    if (rememberMe) {
      res.cookie('rememberMe', '1', {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true
      });
    }
  } else {
    res.cookie('failedLogIn', true);
  }
  res.redirect('/admin-cms');
});

module.exports = router;
