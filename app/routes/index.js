import express from 'express'
import home from './home.js'
import ratesFees from './rates-fees.js'
import aerialTour from './aerial-tour.js'
import memberships from './memberships.js'
import faq from './faq.js'
import gallery from './gallery.js'
import contact from './contact.js'
import about from './about.js'
import rulesRegulations from './rules-regulations.js'
import privacy from './privacy.js'
import sendMail from './send-mail.js'
import cms from './cms/index.js'

const router = express.Router()

router.use('/', home)
router.use('/rates-fees', ratesFees)
router.use('/aerial-tour', aerialTour)
router.use('/memberships', memberships)
router.use('/faq', faq)
router.use('/gallery', gallery)
router.use('/contact', contact)
router.use('/about', about)
router.use('/rules-regulations', rulesRegulations)
router.use('/privacy', privacy)
router.use('/send-mail', sendMail)
router.use('/cms', cms)

export default router
