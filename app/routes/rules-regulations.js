import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('rules-regulations', {
    heroTitle: 'Rules & Regulations',
    heroSubtitle: 'Your Guide to Our Course Regulations',
    heroImg: '/assets/images/drone-6.jpg'
  })
})

export default router
