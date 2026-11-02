import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('faq', {
    heroTitle: 'Frequently Asked Questions',
    heroSubtitle: 'Your Questions, Answered',
    heroImg: '/assets/images/drone-14.jpg'
  })
})

export default router
