import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('contact', {
    heroTitle: 'Contact Us',
    heroSubtitle: 'Let Us Know How We Can Help',
    heroImg: '/assets/images/drone-20.jpg'
  })
})

export default router
