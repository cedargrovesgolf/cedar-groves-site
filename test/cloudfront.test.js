import { describe, it } from 'node:test'
import request from 'supertest'

process.env.ORIGIN_SECRET = 'test-origin-secret'
const { default: app } = await import('../app/app.js')

describe('cloudfront origin header', () => {
  it('rejects requests without the origin header', async () => {
    await request(app).get('/faq').expect(403)
  })

  it('rejects requests with the wrong origin header', async () => {
    await request(app).get('/faq').set('x-origin-verify', 'wrong').expect(403)
  })

  it('allows requests with the origin header', async () => {
    await request(app).get('/faq').set('x-origin-verify', 'test-origin-secret').expect(200)
  })

  it('serves the health check without the origin header', async () => {
    await request(app).get('/health').expect(200)
  })
})
