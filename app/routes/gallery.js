import express from 'express'
import { getGallery } from '../lib/db.js'
import { shownPhotos } from '../lib/storage.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const photos = shownPhotos(await getGallery())
  res.render('gallery', {
    heroTitle: 'Gallery',
    heroSubtitle: 'See the Course',
    heroImg: photos[0]?.full ?? '/assets/images/drone-17.jpg',
    photos
  })
})

export default router
