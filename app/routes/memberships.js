import express from 'express'
import { getMemberships, getSeasonYear } from '../lib/db.js'
import { formatPrice } from '../lib/format.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const [memberships, seasonYear] = await Promise.all([
    getMemberships(),
    getSeasonYear()
  ])

  res.render('memberships', {
    heroTitle: 'Memberships',
    heroSubtitle: 'Join Our Community Today',
    heroImg: '/assets/images/drone-22.jpg',
    seasonPass: formatPrice(memberships?.seasonPass),
    tenRoundPass: formatPrice(memberships?.tenRoundPass),
    seasonYear
  })
})

export default router
