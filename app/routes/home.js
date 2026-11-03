import express from 'express'
import { getGallery, getHours, getReviews } from '../services/db.js'
import { withGalleryUrls } from '../services/storage.js'

const router = express.Router()

const formatTime = time => {
  const [hours, minutes] = time.split(':').map(Number)
  return {
    time: `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}`,
    ampm: hours >= 12 ? 'pm' : 'am'
  }
}

router.get('/', async (req, res) => {
  const [hours, gallery, reviews] = await Promise.all([getHours(), getGallery(), getReviews()])

  res.render('index', {
    heroTitle: 'Cedar Groves Executive\nPar 3 & Driving Range',
    heroSubtitle: 'Golf Course & Driving Range',
    heroImg: '/assets/images/drone-1.jpg',
    openHour: hours.open ? formatTime(hours.open) : null,
    closeHour: hours.close ? formatTime(hours.close) : null,
    overrideMsg: hours.override,
    galleryPhotos: gallery.photos.slice(0, 3).map(withGalleryUrls),
    reviews
  })
})

export default router
