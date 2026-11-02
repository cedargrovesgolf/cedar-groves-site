import express from 'express'
import home from './home.js'
import ratesFees from './rates-fees.js'
import aerialTour from './aerial-tour.js'
import memberships from './memberships.js'
import faq from './faq.js'
import contact from './contact.js'
import about from './about.js'
import rulesRegulations from './rules-regulations.js'
import sendMail from './send-mail.js'
import adminCms from './cms/admin-cms.js'
import auth from './cms/auth.js'
import updateConfig from './cms/update-config.js'
import logout from './cms/logout.js'

const router = express.Router()

router.use('/', home)
router.use('/rates-fees', ratesFees)
router.use('/aerial-tour', aerialTour)
router.use('/memberships', memberships)
router.use('/faq', faq)
router.use('/contact', contact)
router.use('/about', about)
router.use('/rules-regulations', rulesRegulations)
router.use('/send-mail', sendMail)
router.use('/admin-cms', adminCms)
router.use('/cms/auth', auth)
router.use('/cms/update-config', updateConfig)
router.use('/logout', logout)

export default router
