import express from 'express'
import { getGallery, getHours } from '../lib/db.js'
import { withGalleryUrls } from '../lib/storage.js'

const router = express.Router()

const formatTime = time => {
  const [hours, minutes] = time.split(':').map(Number)
  return {
    time: `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}`,
    ampm: hours >= 12 ? 'pm' : 'am'
  }
}

router.get('/', async (req, res) => {
  const [hours, gallery] = await Promise.all([getHours(), getGallery()])

  const reviews = [
    {
      review:
        'I love this course, the people who work there are friendly and the course is great. I love the lay out and it has helped my my chip game a ton.',
      author: 'Allan Shephard',
      stars: 5
    },
    {
      review:
        'By far the most executive par 3 I have ever played. Best greens in the city and the tee boxes were very well maintained. I took my boss for a quick 9 after work and got a raise out of it.',
      author: 'Carson Dorcas',
      stars: 5
    },
    {
      review:
        'Awesome place. Great staff. Ample tee areas. Great putting green. The only thing you really need is ice cream!',
      author: 'D Conzie Connell',
      stars: 5
    },
    {
      review:
        "A nice, challenging par 3 course. Greens are in good shape for how little rain we've had this year. Tee boxes have taken a beating, but is a lot of fun for the price!",
      author: 'Matthew Chase',
      stars: 4
    },
    {
      review: 'A great par 3 course, we are here every week.',
      author: 'Robert Brennan',
      stars: 5
    },
    {
      review:
        'More challenging than I anticipated, which is great. I also loved that there was a recycling bin at each hole. *Patrons... please be courteous and use them!*',
      author: 'Denise Hutton',
      stars: 5
    },
    {
      review:
        'A great place to spend some time practicing on the driving range or the putting green. Very reasonably priced and the staff was friendly.',
      author: 'Brent',
      stars: 4
    },
    {
      review:
        'This is a great par 3 course with the chance to open up with your driver a few times',
      author: 'Mike Davidson',
      stars: 5
    },
    {
      review:
        'Laid out well, staff is friendly. May be an executive par 3, but it has its challenges. This course will test your irons.',
      author: 'Joe Cruise',
      stars: 5
    },
    {
      review:
        'Great 9 hole course with some excellent hazards to make it challenging.',
      author: 'Mike Goddard',
      stars: 4
    }
  ]

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
