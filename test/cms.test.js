import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { app, dynamoSend, googleDiscovery, mockGoogle } from './setup.js'

describe('cms access', () => {
  for (const page of ['/cms/hours', '/cms/nope', '/cms/reviews/google']) {
    it(`redirects anonymous GET ${page} to the login page`, async () => {
      await request(app).get(page).expect(302).expect('Location', '/cms')
    })
  }

  const endpoints = [
    '/cms/hours',
    '/cms/rates',
    '/cms/memberships',
    '/cms/gallery',
    '/cms/gallery/uploads',
    '/cms/reviews'
  ]

  for (const endpoint of endpoints) {
    it(`rejects anonymous POST ${endpoint} without writing`, async () => {
      const callsBefore = dynamoSend.mock.callCount()
      const res = await request(app)
        .post(endpoint)
        .type('form')
        .send({ year: '2030' })
        .expect(401)
      assert.equal(res.body.redirect, '/cms')
      assert.equal(dynamoSend.mock.callCount(), callsBefore)
    })
  }
})

describe('cms login', () => {
  it('rejects emails other than the CMS email without contacting Google', async t => {
    const fetch = mockGoogle(t)
    const res = await request(app).post('/cms/login').type('form').send({ email: 'someone@example.com' }).expect(401)
    assert.equal(res.body.type, 'error')
    assert.equal(fetch.mock.callCount(), 0)
  })

  it('shows a Google sign-in link with PKCE for the CMS email', async t => {
    mockGoogle(t)
    const agent = request.agent(app)
    const res = await agent.post('/cms/login').type('form').send({ email: ' Owner@Example.com ' }).expect(200)
    assert.equal(res.body.redirect, '/cms')
    const page = await agent.get('/cms').expect(200)
    const href = /class="google-button" href="([^"]+)"/.exec(page.text)[1].replaceAll('&amp;', '&')
    const url = new URL(href)
    assert.equal(url.origin + url.pathname, googleDiscovery.authorization_endpoint)
    assert.equal(url.searchParams.get('login_hint'), 'Owner@Example.com')
    assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
    assert.equal(url.searchParams.get('access_type'), 'offline')
  })

  it('ignores a callback without a pending sign-in', async () => {
    await request(app).get('/cms/login/callback?code=abc&state=xyz').expect(302).expect('Location', '/cms')
  })
})
