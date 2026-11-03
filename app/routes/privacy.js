import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('privacy', {
    heroTitle: 'Privacy Policy',
    heroSubtitle: 'How We Handle Your Information',
    heroImg: '/assets/images/drone-21.jpg'
  })
})

export default router
