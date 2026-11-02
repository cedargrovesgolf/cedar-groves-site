/* ./routes/cms/logout.js */
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  req.session = null
  res.redirect('/admin-cms')
})

module.exports = router
