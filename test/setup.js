import { mock } from 'node:test'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

const siteConfig = {
  open: { type: 'open', hour: '08:00' },
  close: { type: 'close', hour: '20:00' },
  season: { type: 'season', data: JSON.stringify({ year: '2026' }) },
  memberships: {
    type: 'memberships',
    data: JSON.stringify({ seasonPass: '550', tenRoundPass: '250' })
  },
  rates: { type: 'rates', data: JSON.stringify({ course_18hole: '38' }) },
  reviews: {
    type: 'reviews',
    data: JSON.stringify([{ id: 'review-1', author: 'Ada Lovelace', stars: 4, text: 'Lovely greens' }])
  },
  gallery: {
    type: 'gallery',
    data: JSON.stringify({
      photos: [
        { id: '00000000-0000-4000-8000-000000000001', caption: 'Ninth green', width: 800, height: 600 }
      ]
    })
  }
}

const secrets = {
  '/cedar-groves/google-client-secret': 'client-secret',
  '/cedar-groves/google-refresh-token': 'refresh-token'
}

process.env.CMS_EMAIL = 'owner@example.com'
process.env.GOOGLE_CLIENT_ID = 'client-id'
process.env.GOOGLE_LOCATION = 'accounts/1/locations/2'

export const dynamoSend = mock.method(DynamoDBDocumentClient.prototype, 'send', async command => {
  if (command instanceof GetCommand) {
    return { Item: siteConfig[command.input.Key.type] }
  }
  throw new Error(`Unexpected ${command.constructor.name}`)
})

mock.method(SSMClient.prototype, 'send', async command => {
  if (command instanceof GetParameterCommand) {
    return { Parameter: { Value: secrets[command.input.Name] } }
  }
  throw new Error(`Unexpected ${command.constructor.name}`)
})

export const googleDiscovery = {
  issuer: 'https://accounts.google.com',
  authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  token_endpoint: 'https://oauth2.googleapis.com/token',
  jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs'
}

export const mockGoogle = (t, reviewPages = {}) => t.mock.method(globalThis, 'fetch', async input => {
  const url = new URL(input instanceof Request ? input.url : input)
  if (url.pathname === '/.well-known/openid-configuration') {
    return Response.json(googleDiscovery)
  }
  if (url.href === googleDiscovery.token_endpoint) {
    return Response.json({ access_token: 'access-token', token_type: 'Bearer', expires_in: 3600 })
  }
  return Response.json(reviewPages[url.searchParams.get('pageToken') ?? ''])
})

export const { default: app } = await import('../app/app.js')
