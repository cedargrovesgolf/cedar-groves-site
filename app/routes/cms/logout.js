/* ./routes/cms/logout.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.loggedin = null;
  req.session.username = null;
  res.redirect('/admin-cms');
});

module.exports = router;
