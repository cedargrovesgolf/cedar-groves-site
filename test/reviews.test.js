import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mockGoogle } from './setup.js'
import { fetchGoogleReviews } from '../app/services/google/reviews.js'

describe('google reviews', () => {
  const review = (reviewId, starRating, comment, createTime) =>
    ({ reviewId, starRating, comment, createTime, reviewer: { displayName: reviewId } })

  it('keeps reviews with text across pages, best and newest first', async t => {
    mockGoogle(t, {
      '': {
        reviews: [
          review('four', 'FOUR', 'Nice', '2025-06-01T00:00:00Z'),
          review('new-five', 'FIVE', 'Great', '2025-01-01T00:00:00Z'),
          review('no-text', 'FIVE', undefined, '2025-02-01T00:00:00Z')
        ],
        nextPageToken: 'page-2'
      },
      'page-2': {
        reviews: [review('old-five', 'FIVE', 'Good', '2024-01-01T00:00:00Z'), review('three', 'THREE', 'Okay', '2025-01-01T00:00:00Z')]
      }
    })

    const reviews = await fetchGoogleReviews()
    assert.deepEqual(reviews.map(({ id }) => id), ['new-five', 'old-five', 'four', 'three'])
  })
})
