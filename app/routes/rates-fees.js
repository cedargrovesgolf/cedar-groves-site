import express from 'express'
import { getRates, getSeasonYear } from '../lib/db.js'
import { formatPrice } from '../lib/format.js'
import { rateSections } from '../lib/rates.js'

const router = express.Router()

const buildRatesFees = rates =>
  rateSections.map(section => ({
    ...section,
    rates: section.rates.map(([desc, key]) => ({ desc, price: formatPrice(rates[key]) }))
  }))

router.get('/', async (req, res) => {
  const [rates, seasonYear] = await Promise.all([getRates(), getSeasonYear()])

  res.render('rates-fees', {
    heroTitle: 'Rates & Fees',
    heroSubtitle: 'Affordable Golf for Every Player',
    heroImg: '/assets/images/drone-2.jpg',
    ratesFees: rates ? buildRatesFees(rates) : null,
    seasonYear
  })
})

export default router
