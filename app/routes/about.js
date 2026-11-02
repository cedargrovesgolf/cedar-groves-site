import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('about', {
    heroTitle: 'About Us',
    heroSubtitle: 'Find Out What Makes Us Unique',
    heroImg: '/assets/images/drone-12.jpg'
  })
})

export default router
