import express from 'express'
import { getHours, getRates, getMemberships, getSeasonYear } from '../../lib/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  if (!req.session.loggedin) {
    return res.render('admin-cms', { loggedIn: false })
  }

  const [hours, rates, memberships, seasonYear] = await Promise.all([
    getHours(),
    getRates(),
    getMemberships(),
    getSeasonYear()
  ])

  res.render('admin-cms', {
    loggedIn: true,
    user: req.session.username,
    openHour: hours.open ?? '',
    closeHour: hours.close ?? '',
    overrideMsg: hours.override ?? '',
    rates: rates || {},
    memberships: memberships || {},
    seasonYear: seasonYear || ''
  })
})

export default router
