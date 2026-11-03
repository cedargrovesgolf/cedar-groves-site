import express from 'express'
import { getGallery } from '../lib/db.js'
import { withGalleryUrls } from '../lib/storage.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const photos = (await getGallery()).photos.map(withGalleryUrls)
  res.render('gallery', {
    heroTitle: 'Gallery',
    heroSubtitle: 'See the Course',
    heroImg: photos[0]?.full ?? '/assets/images/drone-17.jpg',
    photos
  })
})

export default router
