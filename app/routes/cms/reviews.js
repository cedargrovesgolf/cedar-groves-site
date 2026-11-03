import express from 'express'
import { reply } from '../../lib/reply.js'
import { setReviews } from '../../services/db.js'
import { fetchGoogleReviews, getGoogleReviews } from '../../services/google/reviews.js'

const router = express.Router()

router.get('/google', async (req, res) => {
  try {
    return res.json({ reviews: await getGoogleReviews() })
  } catch (err) {
    console.error(err)
    return reply(res, 502, 'error', "Google reviews couldn't be loaded.")
  }
})

router.post('/', async (req, res) => {
  const ids = new Set([req.body?.id ?? []].flat())

  try {
    const googleReviews = new Map((await fetchGoogleReviews()).map(review => [review.id, review]))
    const reviews = [...ids]
      .filter(id => googleReviews.has(id))
      .map(id => {
        const { author, stars, text, createTime } = googleReviews.get(id)
        return { id, author, stars, text, createTime }
      })
    await setReviews(reviews)
    return reply(res, 200, 'success', 'Reviews saved.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the reviews.')
  }
})

export default router
