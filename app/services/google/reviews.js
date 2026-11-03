import config from '../../config.js'
import { getAccessToken } from './oauth.js'

const timeout = 10000
const cacheTtl = 5 * 60 * 1000
const starValues = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }

let cache

const fetchReviewPage = async (token, pageToken) => {
  const url = new URL(`https://mybusiness.googleapis.com/v4/${config.googleLocation}/reviews`)
  url.searchParams.set('pageSize', '50')
  if (pageToken) {
    url.searchParams.set('pageToken', pageToken)
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(timeout)
  })
  if (!response.ok) {
    throw new Error(`Google reviews request failed with ${response.status}`)
  }
  return response.json()
}

export const fetchGoogleReviews = async () => {
  const token = await getAccessToken()
  const reviews = []
  let pageToken
  do {
    const page = await fetchReviewPage(token, pageToken)
    reviews.push(...(page.reviews ?? []))
    pageToken = page.nextPageToken
  } while (pageToken)

  const result = reviews
    .map(review => ({
      id: review.reviewId,
      author: review.reviewer?.displayName ?? '',
      stars: starValues[review.starRating],
      text: review.comment?.trim() ?? '',
      createTime: review.createTime ?? ''
    }))
    .filter(review => review.stars && review.text)
    .sort((a, b) => b.stars - a.stars || b.createTime.localeCompare(a.createTime))

  cache = { reviews: result, expiresAt: Date.now() + cacheTtl }
  return result
}

export const getGoogleReviews = async () =>
  cache && cache.expiresAt > Date.now() ? cache.reviews : fetchGoogleReviews()
