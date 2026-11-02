/* ./routes/404.js */
const express = require('express')
const router = express.Router()

router.use((req, res) => {
  // render the page
  res.status(404).render('404')
})

module.exports = router
