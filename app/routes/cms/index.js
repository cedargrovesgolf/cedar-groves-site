import express from 'express'
import { reply } from '../../lib/reply.js'
import content from './content.js'
import gallery from './gallery.js'
import login from './login.js'
import logout from './logout.js'
import pages from './pages.js'

const router = express.Router()

router.use((req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow')
  next()
})

router.use('/login', login)
router.use('/logout', logout)
router.use(pages)

router.use((req, res, next) => {
  if (req.session.loggedin) {
    return next()
  }
  if (req.method === 'GET') {
    return res.redirect('/cms')
  }
  return reply(res, 401, 'error', 'Please log in again.', { redirect: '/cms' })
})

router.use(content)
router.use('/gallery', gallery)

export default router
