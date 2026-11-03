import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { app } from './setup.js'

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
