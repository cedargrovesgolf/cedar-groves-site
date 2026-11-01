/* ./routes/cms/logout.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/admin-cms');
  });
});

module.exports = router;
