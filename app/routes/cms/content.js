import express from 'express'
import { setHours, setRates, setMemberships, setSeasonYear } from '../../services/db.js'
import { rateKeys } from '../../lib/rates.js'
import { reply } from '../../lib/reply.js'

const router = express.Router()

const isTime = value => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

const isPrice = value =>
  typeof value === 'string' && /^(\d+|\d{1,3}(,\d{3})+)(\.\d{1,2})?$/.test(value.trim())

router.post('/hours', async (req, res) => {
  const { status, openHour, closeHour, overrideMsg } = req.body ?? {}
  const times = isTime(openHour) && isTime(closeHour) ? { open: openHour, close: closeHour } : {}
  let hours

  if (status === 'open') {
    if (!times.open) {
      return reply(res, 400, 'error', 'Please enter both an opening and a closing time.')
    }
    hours = times
  } else if (status === 'message') {
    const message = typeof overrideMsg === 'string' ? overrideMsg.trim() : ''
    if (!message || message.length > 200) {
      return reply(res, 400, 'error', 'Please enter a message of up to 200 characters.')
    }
    hours = { ...times, override: message }
  } else if (status === 'closed') {
    hours = {}
  } else {
    return reply(res, 400, 'error', 'Please choose open, closed, or a custom message.')
  }

  try {
    await setHours(hours)
    return reply(res, 200, 'success', 'Hours saved.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the hours.')
  }
})

router.post('/rates', async (req, res) => {
  const body = req.body ?? {}

  if (!rateKeys.every(key => isPrice(body[key]))) {
    return reply(res, 400, 'error', 'All rates must be valid prices.')
  }

  try {
    await setRates(Object.fromEntries(rateKeys.map(key => [key, body[key].trim()])))
    return reply(res, 200, 'success', 'Rates saved.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the rates.')
  }
})

router.post('/memberships', async (req, res) => {
  const { year, seasonPass, tenRoundPass } = req.body ?? {}

  if (typeof year !== 'string' || !/^\d{4}$/.test(year)) {
    return reply(res, 400, 'error', 'Please enter a valid 4-digit season year.')
  }
  if (!isPrice(seasonPass) || !isPrice(tenRoundPass)) {
    return reply(res, 400, 'error', 'All membership prices must be valid prices.')
  }

  try {
    await Promise.all([
      setSeasonYear(year),
      setMemberships({ seasonPass: seasonPass.trim(), tenRoundPass: tenRoundPass.trim() })
    ])
    return reply(res, 200, 'success', 'Memberships saved.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the memberships.')
  }
})

export default router
