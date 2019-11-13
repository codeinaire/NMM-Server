import createJWKSMock from 'mock-jwks'
import { Authorisation } from '../Authorisation'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { IModifiedObject } from '../../types'

const TOKEN_ISSUER = 'https://test-app.com/'

describe('Authorisation class', () => {
  const ENVS = {
    audience: '',
    issuer: '',
    jwsUri: ''
  }
  beforeAll(() => {
    ENVS.audience = process.env.AUDIENCE || ''
    ENVS.issuer = process.env.TOKEN_ISSUER || ''
    ENVS.jwsUri = process.env.JWS_URI || ''

    process.env.JWS_URI = 'https://test-app.com/.well-known/jwks.json'
    process.env.TOKEN_ISSUER = 'https://test-app.com/'
    process.env.AUDIENCE = 'https://test-app.com/test/'
  })

  afterAll(() => {
    process.env.AUDIENCE = ENVS.audience
    process.env.TOKEN_ISSUER = ENVS.issuer
    process.env.JWS_URI = ENVS.jwsUri
  })

  describe('[Auth.checkScopesAndResolve()] is given an event with a [VALID] Bearer authorization token & [VALID & CORRECT] scope', () => {
    it('Returned - true', async () => {
      const authorisation = new Authorisation()

      const jwksMock = createJWKSMock(TOKEN_ISSUER)
      await jwksMock.start()

      const accessToken = jwksMock.token({
        aud: ['https://test-app.com/test/'],
        iss: TOKEN_ISSUER,
        sub: 'test-user',
        scope: 'correct scope'
      })
      const mockedEvent = customMockedEvent({
        authorization: `Bearer ${accessToken}`
      })

      await expect(
        authorisation.checkScopesAndResolve(mockedEvent, ['correct', 'scope'])
      ).resolves.toEqual(true)
      await jwksMock.stop()
    })
  })

  describe('[Auth.checkScopesAndResolve()] ERRORS', () => {
    describe('Given an event with an [INVALID] authorisation Bearer token', () => {
      it('Returned - Error: Invalid Token', async () => {
        const authorisation = new Authorisation()
        const mockedEvent = customMockedEvent({
          authorization: 'Bearer invalid token'
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('Invalid Token'))
      })
    })

    describe('Given an event with [NO] authorisation Bearer token', () => {
      it('Returned - Expected "event.headers.authorization" parameter to be set', () => {
        const authorisation = new Authorisation()
        const mockedEvent = customMockedEvent({
          authorization: ''
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(
          new Error(
            'Expected "event.headers.authorization" parameter to be set'
          )
        )
      })
    })

    describe('Given an event with an [EMPTY] authorisation token', () => {
      it(`Returned - Invalid Authorization token - '' does not match "Bearer .*"`, () => {
        const authorisation = new Authorisation()
        const mockedEvent = customMockedEvent({
          authorization: 'Bearer'
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(
          new Error(
            'Invalid Authorization token - Bearer does not match "Bearer .*"'
          )
        )
      })
    })

    describe('Given an event with an [EMPTY] scope', () => {
      it('Returned - No scopes supplied!', async () => {
        const authorisation = new Authorisation()
        const jwksMock = createJWKSMock(TOKEN_ISSUER)
        await jwksMock.start()

        const accessToken = jwksMock.token({
          aud: ['https://test-app.com/test/'],
          iss: TOKEN_ISSUER,
          sub: 'test-user',
          scope: ''
        })
        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        })

        await expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('No scopes supplied!'))
        await jwksMock.stop()
      })
    })

    describe('Given an event with an [INCORRECT] scope', () => {
      it('Returned - You are not authorized!', async () => {
        const authorisation = new Authorisation()
        const jwksMock = createJWKSMock(TOKEN_ISSUER)
        await jwksMock.start()

        const accessToken = jwksMock.token({
          aud: ['https://test-app.com/test/'],
          iss: TOKEN_ISSUER,
          sub: 'test-user',
          scope: 'incorrect scope'
        })

        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        })

        await expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('You are not authorized!'))
        await jwksMock.stop()
      })
    })
  })
})

function customMockedEvent(
  modificationObject: IModifiedObject
): APIGatewayProxyEvent {
  return {
    body: '{"body": "mock body"}',
    headers: {
      mockHeaders: 'mock header',
      authorization: `${modificationObject.authorization}`
    },
    httpMethod: 'POST',
    multiValueHeaders: {
      authorization: ['invalid token']
    },
    isBase64Encoded: false,
    multiValueQueryStringParameters: null,
    path: '/nmm-app',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {
      accountId: 'offlineContext_accountId',
      apiId: 'offlineContext_apiId',
      authorizer: {
        principalId: 'offlineContext_authorizer_principalId',
        claims: [Object]
      },
      httpMethod: 'POST',
      identity: {
        accessKey: 'test string',
        accountId: 'test string',
        apiKey: 'test string',
        apiKeyId: 'test string',
        caller: 'test string',
        cognitoAuthenticationProvider: 'test string',
        cognitoAuthenticationType: 'test string',
        cognitoIdentityId: 'test string',
        cognitoIdentityPoolId: 'test string',
        sourceIp: 'test string',
        user: 'test string',
        userAgent: 'test string',
        userArn: 'test string'
      },
      path: 'test path',
      requestId: 'offlineContext_requestId_ck1lg5mc8000j3aeh0hjq82sm',
      requestTimeEpoch: 1570756990015,
      resourceId: 'offlineContext_resourceId',
      resourcePath: '/nmm-app',
      stage: 'dev'
    },
    resource: '/nmm-app',
    stageVariables: null
  }
}
