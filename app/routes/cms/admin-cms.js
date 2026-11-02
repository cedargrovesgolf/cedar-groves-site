/* ./routes/cms/admin-cms.js */
const express = require('express')
const router = express.Router()
const { getHours, getRates, getMemberships, getSeasonYear } = require('../../lib/db')

router.get('/', async (req, res) => {
  const failedLogIn = req.session.failedLogIn ?? false
  delete req.session.failedLogIn

  const loggedIn = req.session.loggedin
  let body

  const [hours, rates, memberships, seasonYear] = await Promise.all([
    getHours(),
    getRates(),
    getMemberships(),
    getSeasonYear()
  ])

  if (loggedIn) {
    const username = req.session.username
    body = {
      failedLogIn: false,
      loggedIn: loggedIn,
      user: username,
      openHour: hours.open ?? '',
      closeHour: hours.close ?? '',
      overrideMsg: hours.override ?? '',
      rates: rates || {},
      memberships: memberships || {},
      seasonYear: seasonYear || '',
      updateSuccess: req.session.updateSuccess ?? null,
      updateError: req.session.updateError ?? null
    }
    delete req.session.updateSuccess
    delete req.session.updateError
  } else {
    body = { loggedIn: false, failedLogIn: failedLogIn }
  }
  // render the page
  res.render('admin-cms', body)
})

module.exports = router
