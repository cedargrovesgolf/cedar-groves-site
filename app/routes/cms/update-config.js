import express from 'express'
import { setHours, setRates, setMemberships, setSeasonYear } from '../../lib/db.js'
import { reply } from '../../lib/reply.js'

const router = express.Router()

router.use((req, res, next) => {
  if (!req.session.loggedin) {
    return reply(res, 401, 'error', 'Please log in again.', { redirect: '/admin-cms' })
  }
  next()
})

router.post('/hours', async (req, res) => {
  const { openHour, closeHour, overrideMsg, isClosed } = req.body ?? {}

  if (!isClosed && !openHour && !closeHour && !overrideMsg) {
    return reply(res, 400, 'error', 'Please update the hours, provide an override message, or select "CLOSED" to update.')
  }

  try {
    await setHours(
      isClosed ? {} : { open: openHour, close: closeHour, override: overrideMsg }
    )
    return reply(res, 200, 'success', overrideMsg ? 'Message updated successfully!' : 'Hours updated successfully!')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', overrideMsg
      ? 'There was an error when updating the override message.'
      : 'There was an error when updating the hours.')
  }
})

router.post('/season', async (req, res) => {
  const { year } = req.body ?? {}

  if (!year || !/^\d{4}$/.test(year)) {
    return reply(res, 400, 'error', 'Please provide a valid 4-digit year.')
  }

  try {
    await setSeasonYear(year)
    return reply(res, 200, 'success', 'Season year updated successfully!')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error when updating the season year.')
  }
})

const isPrice = value =>
  typeof value === 'string' && /^(\d+|\d{1,3}(,\d{3})+)(\.\d{1,2})?$/.test(value.trim())

const rateKeys = [
  'course_9hole', 'course_9hole_senior', 'course_9hole_junior',
  'course_18hole', 'course_18hole_senior', 'course_18hole_junior',
  'range_s', 'range_m', 'range_l', 'range_xl', 'range_grass',
  'amenity_rental', 'amenity_pullcart', 'amenity_balls', 'amenity_tees',
  'amenity_water', 'amenity_gatorade', 'amenity_snacks'
]

router.post('/rates', async (req, res) => {
  const body = req.body ?? {}
  const rates = {}

  for (const key of rateKeys) {
    const value = body[key]
    if (!isPrice(value)) {
      return reply(res, 400, 'error', 'All rate fields must be valid numbers.')
    }
    rates[key] = value.trim()
  }

  try {
    await setRates(rates)
    return reply(res, 200, 'success', 'Rates updated successfully!')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error when updating the rates.')
  }
})

router.post('/memberships', async (req, res) => {
  const { seasonPass, tenRoundPass } = req.body ?? {}

  if (!isPrice(seasonPass) || !isPrice(tenRoundPass)) {
    return reply(res, 400, 'error', 'All membership prices must be valid numbers.')
  }

  try {
    await setMemberships({ seasonPass: seasonPass.trim(), tenRoundPass: tenRoundPass.trim() })
    return reply(res, 200, 'success', 'Membership prices updated successfully!')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error when updating the membership prices.')
  }
})

export default router
