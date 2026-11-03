import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { app } from './setup.js'

describe('pages', () => {
  const pages = [
    '/',
    '/rates-fees',
    '/aerial-tour',
    '/aerial-tour?hole=1',
    '/memberships',
    '/faq',
    '/gallery',
    '/contact',
    '/about',
    '/rules-regulations',
    '/privacy',
    '/cms',
    '/health'
  ]

  for (const page of pages) {
    it(`GET ${page} returns 200`, async () => {
      await request(app).get(page).expect(200)
    })
  }

  it('renders stored prices as formatted currency', async () => {
    const memberships = await request(app).get('/memberships').expect(200)
    assert.match(memberships.text, /\$550\.00/)
    const rates = await request(app).get('/rates-fees').expect(200)
    assert.match(rates.text, /\$38\.00/)
  })

  it('renders gallery photos', async () => {
    const res = await request(app).get('/gallery').expect(200)
    assert.match(res.text, /Ninth green/)
    const home = await request(app).get('/').expect(200)
    assert.match(home.text, /\/assets\/gallery\/00000000-0000-4000-8000-000000000001-thumb\.jpg/)
  })

  it('renders stored reviews on the homepage', async () => {
    const res = await request(app).get('/').expect(200)
    assert.match(res.text, /Lovely greens/)
    assert.match(res.text, /Ada Lovelace/)
  })

  it('returns 404 for unknown paths', async () => {
    await request(app).get('/does-not-exist').expect(404)
  })

  it('renders the hole overview for an unknown hole', async () => {
    const res = await request(app).get('/aerial-tour?hole=99').expect(200)
    assert.match(res.text, /\/assets\/images\/drone-17\.jpg/)
  })
})
