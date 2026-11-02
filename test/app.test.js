import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

const siteConfig = {
  open: { type: 'open', hour: '08:00' },
  close: { type: 'close', hour: '20:00' },
  season: { type: 'season', data: JSON.stringify({ year: '2026' }) },
  memberships: {
    type: 'memberships',
    data: JSON.stringify({ seasonPass: '550', tenRoundPass: '250' })
  },
  rates: { type: 'rates', data: JSON.stringify({ course_18hole: '38' }) }
}

const send = mock.method(DynamoDBDocumentClient.prototype, 'send', async command => {
  if (command instanceof GetCommand) {
    return { Item: siteConfig[command.input.Key.type] }
  }
  throw new Error(`Unexpected ${command.constructor.name}`)
})

const { default: app } = await import('../app/app.js')

describe('pages', () => {
  const pages = [
    '/',
    '/rates-fees',
    '/aerial-tour',
    '/aerial-tour?hole=1',
    '/memberships',
    '/faq',
    '/contact',
    '/about',
    '/rules-regulations',
    '/admin-cms',
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

  it('returns 404 for unknown paths', async () => {
    await request(app).get('/does-not-exist').expect(404)
  })

  it('renders the hole overview for an unknown hole', async () => {
    const res = await request(app).get('/aerial-tour?hole=99').expect(200)
    assert.match(res.text, /\/assets\/images\/drone-17\.jpg/)
  })
})

describe('cms', () => {
  for (const form of ['hours', 'season', 'rates', 'memberships']) {
    it(`rejects anonymous POST /cms/update-config/${form} without writing`, async () => {
      const callsBefore = send.mock.callCount()
      const res = await request(app)
        .post(`/cms/update-config/${form}`)
        .type('form')
        .send({ year: '2030' })
        .expect(401)
      assert.equal(res.body.redirect, '/admin-cms')
      assert.equal(send.mock.callCount(), callsBefore)
    })
  }
})

describe('request guards', () => {
  it('rejects cross-site POSTs', async () => {
    await request(app).post('/send-mail').set('Sec-Fetch-Site', 'cross-site').expect(403)
  })
})

describe('contact form', () => {
  const valid = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    to: 'ada@example.com',
    subject: 'Tee times',
    message: 'Hello',
    recaptchaResponse: 'token'
  }

  const invalidBodies = {
    'missing fields': {},
    'oversized message': { ...valid, message: 'x'.repeat(5001) },
    'invalid email': { ...valid, to: 'not-an-email' }
  }

  for (const [name, body] of Object.entries(invalidBodies)) {
    it(`rejects ${name} without calling reCAPTCHA`, async t => {
      const fetch = t.mock.method(globalThis, 'fetch', async () => {
        throw new Error('fetch should not be called')
      })
      const res = await request(app)
        .post('/send-mail')
        .type('form')
        .send(body)
        .expect(400)
        .expect('Content-Type', /json/)
      assert.equal(res.body.type, 'error')
      assert.equal(fetch.mock.callCount(), 0)
    })
  }
})
