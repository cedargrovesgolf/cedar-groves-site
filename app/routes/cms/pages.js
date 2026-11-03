import express from 'express'
import {
  getGallery,
  getHours,
  getMemberships,
  getRates,
  getSeasonYear
} from '../../lib/db.js'
import { rateSections } from '../../lib/rates.js'
import { withGalleryUrls } from '../../lib/storage.js'

const router = express.Router()

const toTimeValue = time => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time ?? '')
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : ''
}

const hoursStatus = ({ open, close, override }) => {
  if (override) {
    return 'message'
  }
  return open && close ? 'open' : 'closed'
}

const sections = {
  hours: {
    title: 'Hours',
    load: async () => {
      const hours = await getHours()
      return {
        status: hoursStatus(hours),
        openHour: toTimeValue(hours.open),
        closeHour: toTimeValue(hours.close),
        overrideMsg: hours.override ?? ''
      }
    }
  },
  rates: {
    title: 'Rates',
    load: async () => ({ rates: (await getRates()) || {}, rateSections })
  },
  memberships: {
    title: 'Memberships',
    load: async () => {
      const [memberships, seasonYear] = await Promise.all([getMemberships(), getSeasonYear()])
      return { memberships: memberships || {}, seasonYear: seasonYear || '' }
    }
  },
  gallery: {
    title: 'Gallery',
    load: async () => {
      const { photos, version } = await getGallery()
      return { photos: photos.map(withGalleryUrls), version }
    }
  }
}

router.get('/', (req, res) => {
  if (!req.session.loggedin) {
    return res.render('cms', { loggedIn: false })
  }
  res.redirect(`/cms/${Object.keys(sections)[0]}`)
})

router.get('/:section', async (req, res, next) => {
  const { section } = req.params
  if (!Object.hasOwn(sections, section)) {
    return next()
  }
  if (!req.session.loggedin) {
    return res.redirect('/cms')
  }

  res.render('cms', {
    loggedIn: true,
    section,
    sections: Object.entries(sections).map(([key, { title }]) => ({ key, title })),
    title: sections[section].title,
    ...(await sections[section].load())
  })
})

export default router
