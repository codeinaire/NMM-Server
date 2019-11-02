import createJWKSMock from 'mock-jwks';
import Auth from '../auth';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { IModifiedObject } from '../../types';

describe('Authentication and Authorization class', () => {
  afterAll(async done => {
    done();
  });

  describe('[Auth.checkScopesAndResolve()] is given an event with a [VALID] Bearer authorization token & [VALID & CORRECT] scope', () => {
    it('Returned - true', async (done) => {
      const {accessToken, jwksMock} = createJwksContext();
      done();

      const mockedEvent = customMockedEvent({
        authorization: `Bearer ${accessToken}`
      });

      const authInstance = new Auth();
      const authCheck = await authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);

      expect(authCheck).toBe('test user');
      jwksMock.stop();
    })
  })

  describe('[Auth.checkScopesAndResolve()] ERRORS', () => {
    describe('Given an event with an [INVALID] authorization Bearer token', () => {
      it('Returned - Error: Invalid Token', async (done) => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: 'Bearer invalid token'
        });

        expect( async () => {
          await authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);
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
          await authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);
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
          await authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);
          done();
        }).toThrow(`Invalid Authorization token - '' does not match "Bearer .*"`);
      })
    })

    describe('Given an event with an [EMPTY] scope', () => {
      it('Returned - No scopes supplied!', async (done) => {
        const {accessToken, jwksMock} = await createJwksContext({
          sub: 'test user',
          scope: '',
        })
        done();

        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        });

        const authInstance = new Auth();

        expect( async () => {
          await authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);
          done();
        }).toThrow('No scopes supplied!');
        jwksMock.stop();
      })
    })

    describe('Given an event with an [INCORRECT] scope', () => {
      it('Returned - You are not authorized!', async (done) => {
        const {accessToken, jwksMock} = await createJwksContext({
          sub: 'test user',
          scope: 'incorrect scope'
        });
        done();

        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        });

        const authInstance = new Auth();

        expect( async () => {
          await authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);
          done();
        }).toThrow('No scopes supplied!');
        jwksMock.stop();
      })
    })
  })
})

function createJwksContext(userObject: { sub: string, scope: string} = { sub: 'test user', scope: 'test scope'}): any {
  process.env.JWKS_URI = 'https://test-app.com/.well-known/jwks.json';
  process.env.TOKEN_ISSUER = 'https://test-app.com/';
  process.env.AUDIENCE = 'https://test-app.com/test/';

  const jwksMock = createJWKSMock('https://test-app.com/')

  const accessToken = jwksMock.token({
    aud: [
      'https://test-app.com/test/'
    ],
    iss: 'https://test-app.com/',
    sub: `${userObject.sub}`,
    scope: `${userObject.scope}`
  })

  return { accessToken, jwksMock };
}


function customMockedEvent(modificationObject: IModifiedObject): APIGatewayProxyEvent {
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