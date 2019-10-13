// import { mocked } from 'ts-jest/utils';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { ModifiedObject } from '../../types';

import createJWKSMock from 'mock-jwks';
import Auth from '../auth';

describe('Authentication and Authorization class', () => {
  describe('[Auth.checkAuthAndResolve()] is given an event with a VALID Bearer authorization token', () => {
    it('Returned - true', async (done) => {
      process.env.JWKS_URI = 'https://test-app.com/.well-known/jwks.json';
      process.env.TOKEN_ISSUER = 'https://test-app.com/';
      process.env.AUDIENCE = 'https://test-app.com/test/';

      const jwksMock = createJWKSMock('https://test-app.com/')
      const accessToken = jwksMock.token({
        aud: [
          'https://test-app.com/test/'
        ],
        iss: 'https://test-app.com/',
        sub: 'test user',
        scope: 'test scope'
      })
      jwksMock.start();

      const mockedEvent = customMockedEvent({
      authorization: `Bearer ${accessToken}`
      });

      const authInstance = new Auth();
      const authCheck = await authInstance.checkAuthAndResolve(mockedEvent);

      expect(authCheck).toBe(true);
      done()
    })
  })

  describe('[Auth.checkAuthAndResolve()] ERRORS', () => {
    describe('Given an event with an [INVALID] authorization Bearer token', () => {
      it('Returned - Error: Invalid Token', async (done) => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: 'Bearer invalid token'
        });

        expect( async () => {
          await authInstance.checkAuthAndResolve(mockedEvent);
          done();
        }).toThrow('Error: Invalid Token');
      })
    })

    describe('Given an event with [NO] authorization Bearer token', () => {
      it('Returned - Expected "event.headers.authorization" parameter to be set', async (done) => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: ''
        });

        expect( async () => {
          await authInstance.checkAuthAndResolve(mockedEvent);
          done();
        }).toThrow('Expected "event.headers.authorization" parameter to be set');
      })
    })

    describe('Given an event with an [EMPTY] authorization token', () => {
      it(`Returned - Invalid Authorization token - '' does not match "Bearer .*"`, async (done) => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: 'Bearer'
        });

        expect( async () => {
          await authInstance.checkAuthAndResolve(mockedEvent);
          done();
        }).toThrow(`Invalid Authorization token - '' does not match "Bearer .*"`);
      })
    })
  })
})


function customMockedEvent(modificationObject: ModifiedObject): APIGatewayProxyEvent {
  return {
    body: '{"body": "mock body"}',
    headers: {
      mockHeaders: 'mock header',
      authorization: `${modificationObject.authorization}`,
    },
    httpMethod: 'POST',
    multiValueHeaders: {
      authorization: [
        'invalid token'
      ]
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
        userArn: 'test string',
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