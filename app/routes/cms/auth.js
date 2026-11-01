/* ./routes/cms/auth.js */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getItem } = require('../../helper/dynamo-helper');
const { compareHash } = require('../../helper/hash');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again after 15 minutes'
});

router.post('/', loginLimiter, async (req, res, next) => {
  const { username, password, rememberMe } = req.body;

  const userQuery = {
    tableName: 'cedar-groves-cms-users',
    keyName: 'userID',
    keyType: 'N',
    keyValue: '0'
  };
  const user = await getItem(userQuery);
  const usernameMatches = typeof username === 'string' && username === user?.username.S;
  const passwordMatches = await compareHash(
    typeof password === 'string' ? password : '',
    usernameMatches ? user.passwordHash.S : undefined
  );

  if (usernameMatches && passwordMatches) {
    return req.session.regenerate(err => {
      if (err) {
        return next(err);
      }
      req.session.loggedin = true;
      req.session.username = username;

      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }
      res.redirect('/admin-cms');
    });
  }

  req.session.failedLogIn = true;
  res.redirect('/admin-cms');
});

module.exports = router;
