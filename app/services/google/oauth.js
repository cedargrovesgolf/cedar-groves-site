import * as oidc from 'openid-client'
import config from '../../config.js'
import { getSecret, putSecret } from '../secrets.js'

const scope = 'openid email https://www.googleapis.com/auth/business.manage'
const redirectUri = `${config.siteUrl}/cms/login/callback`

let oidcConfig

const getOidcConfig = () => {
  oidcConfig ??= getSecret('google-client-secret')
    .then(clientSecret => oidc.discovery(new URL('https://accounts.google.com'), config.googleClientId, clientSecret))
    .catch(err => {
      oidcConfig = undefined
      throw err
    })
  return oidcConfig
}

export const createSignIn = async email => {
  const [googleConfig, refreshToken] = await Promise.all([getOidcConfig(), getSecret('google-refresh-token')])
  const codeVerifier = oidc.randomPKCECodeVerifier()
  const state = oidc.randomState()
  const url = oidc.buildAuthorizationUrl(googleConfig, {
    redirect_uri: redirectUri,
    scope,
    code_challenge: await oidc.calculatePKCECodeChallenge(codeVerifier),
    code_challenge_method: 'S256',
    state,
    login_hint: email,
    access_type: 'offline',
    ...(refreshToken ? {} : { prompt: 'consent' })
  })
  return { url: url.href, codeVerifier, state }
}

export const completeSignIn = async (callbackPath, { codeVerifier, state }) => {
  const tokens = await oidc.authorizationCodeGrant(
    await getOidcConfig(),
    new URL(callbackPath, config.siteUrl),
    { pkceCodeVerifier: codeVerifier, expectedState: state, idTokenExpected: true }
  )
  const claims = tokens.claims()
  return {
    email: claims.email_verified ? claims.email : null,
    refreshToken: tokens.refresh_token
  }
}

export const saveRefreshToken = token => putSecret('google-refresh-token', token)

let accessToken

export const getAccessToken = async () => {
  if (accessToken && accessToken.expiresAt > Date.now()) {
    return accessToken.value
  }
  const refreshToken = await getSecret('google-refresh-token')
  if (!refreshToken) {
    throw new Error('Google is not connected')
  }
  const tokens = await oidc.refreshTokenGrant(await getOidcConfig(), refreshToken)
  accessToken = { value: tokens.access_token, expiresAt: Date.now() + (tokens.expires_in - 60) * 1000 }
  return accessToken.value
}
