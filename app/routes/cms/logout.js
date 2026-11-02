import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  req.session = null
  res.redirect('/cms')
})

export default router
