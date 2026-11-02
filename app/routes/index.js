const express = require('express')

const router = express.Router()

router.use('/', require('./home'))
router.use('/rates-fees', require('./rates-fees'))
router.use('/aerial-tour', require('./aerial-tour'))
router.use('/memberships', require('./memberships'))
router.use('/faq', require('./faq'))
router.use('/contact', require('./contact'))
router.use('/about', require('./about'))
router.use('/rules-regulations', require('./rules-regulations'))
router.use('/send-mail', require('./send-mail'))
router.use('/admin-cms', require('./cms/admin-cms'))
router.use('/cms/auth', require('./cms/auth'))
router.use('/cms/update-config', require('./cms/update-config'))
router.use('/logout', require('./cms/logout'))

module.exports = router
