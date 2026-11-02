import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  req.session = null
  res.redirect('/admin-cms')
})

export default router
